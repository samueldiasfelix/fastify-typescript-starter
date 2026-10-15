import { randomUUIDv7 } from 'node:crypto';
import { fastifyAwilixPlugin } from '@fastify/awilix';
import fastify from 'fastify';
import { expect, test } from 'vitest';

import { createDiContainer } from '#/container';
import customerModule from '#/modules/customers/customer.module';
import userModule from '#/modules/users/user.module';

async function buildApp() {
  const app = fastify();
  await app.register(fastifyAwilixPlugin, {
    container: createDiContainer(),
    disposeOnClose: true,
    disposeOnResponse: true,
  });
  await app.register(userModule, { prefix: '/users' });
  await app.register(customerModule, { prefix: '/customers' });
  return app;
}

test('customer CRUD shares users, paginates and isolates applications', async () => {
  const app = await buildApp();
  const otherApp = await buildApp();
  try {
    const userResponse = await app.inject({
      method: 'POST',
      url: '/users/',
      payload: { name: 'Alice', email: 'alice@example.com' },
    });
    expect(userResponse.statusCode).toBe(201);
    const userId = userResponse.json().id;
    const created = await app.inject({
      method: 'POST',
      url: '/customers/',
      payload: { userId },
    });
    expect(created.statusCode).toBe(201);
    const customer = created.json();
    expect(customer).toEqual({ id: expect.any(String), userId });
    expect((await app.inject('/customers/')).json()).toEqual([customer]);
    expect((await app.inject(`/customers/${customer.id}`)).json()).toEqual(
      customer,
    );
    expect((await otherApp.inject('/customers/')).json()).toEqual([]);
    const isolated = await otherApp.inject({
      method: 'POST',
      url: '/customers/',
      payload: { userId },
    });
    expect(isolated.statusCode).toBe(404);
    expect(isolated.json().code).toBe('USER_NOT_FOUND');

    const secondUser = await app.inject({
      method: 'POST',
      url: '/users/',
      payload: { name: 'Bob', email: 'bob@example.com' },
    });
    const secondUserId = secondUser.json().id;
    const second = await app.inject({
      method: 'POST',
      url: '/customers/',
      payload: { userId: secondUserId },
    });
    expect(second.statusCode).toBe(201);
    expect((await app.inject('/customers/?limit=1&offset=1')).json()).toEqual([
      second.json(),
    ]);

    const invalidUpdate = await app.inject({
      method: 'PATCH',
      url: `/customers/${customer.id}`,
      payload: { userId: randomUUIDv7() },
    });
    expect(invalidUpdate.statusCode).toBe(404);
    expect(invalidUpdate.json().code).toBe('USER_NOT_FOUND');
    expect((await app.inject(`/customers/${customer.id}`)).json()).toEqual(
      customer,
    );

    const updated = await app.inject({
      method: 'PATCH',
      url: `/customers/${customer.id}`,
      payload: { userId: secondUserId },
    });
    expect(updated.statusCode).toBe(200);
    expect(updated.json()).toEqual({ ...customer, userId: secondUserId });
    const deleted = await app.inject({
      method: 'DELETE',
      url: `/customers/${customer.id}`,
    });
    expect(deleted.statusCode).toBe(204);
    expect(deleted.body).toBe('');
    const missing = await app.inject(`/customers/${customer.id}`);
    expect(missing.statusCode).toBe(404);
    expect(missing.json().code).toBe('CUSTOMER_NOT_FOUND');
  } finally {
    await app.close();
    await otherApp.close();
  }
});

test('rejects invalid requests and missing customers or users', async () => {
  const app = await buildApp();
  try {
    for (const payload of [{}, { userId: 'invalid' }]) {
      const response = await app.inject({
        method: 'POST',
        url: '/customers/',
        payload,
      });
      expect(response.statusCode).toBe(400);
    }
    const missingUser = await app.inject({
      method: 'POST',
      url: '/customers/',
      payload: { userId: randomUUIDv7() },
    });
    expect(missingUser.statusCode).toBe(404);
    expect(missingUser.json().code).toBe('USER_NOT_FOUND');
    expect((await app.inject('/customers/')).json()).toEqual([]);
    for (const url of [
      '/customers/not-a-uuid',
      '/customers/?limit=0',
      '/customers/?limit=101',
      '/customers/?offset=-1',
    ]) {
      expect((await app.inject(url)).statusCode).toBe(400);
    }
    const emptyUpdate = await app.inject({
      method: 'PATCH',
      url: `/customers/${randomUUIDv7()}`,
      payload: {},
    });
    expect(emptyUpdate.statusCode).toBe(400);
    const missingUpdate = await app.inject({
      method: 'PATCH',
      url: `/customers/${randomUUIDv7()}`,
      payload: { userId: randomUUIDv7() },
    });
    expect(missingUpdate.statusCode).toBe(404);
    expect(missingUpdate.json().code).toBe('CUSTOMER_NOT_FOUND');
    const missingDelete = await app.inject({
      method: 'DELETE',
      url: `/customers/${randomUUIDv7()}`,
    });
    expect(missingDelete.statusCode).toBe(404);
    expect(missingDelete.json().code).toBe('CUSTOMER_NOT_FOUND');
  } finally {
    await app.close();
  }
});
