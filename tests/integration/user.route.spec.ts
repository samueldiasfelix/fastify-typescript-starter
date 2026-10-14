import fastify from 'fastify';
import { expect, test } from 'vitest';
import userModule from '#/modules/users/user.module';

async function buildApp() {
  const app = fastify();
  await app.register(userModule, { prefix: '/users' });
  return app;
}

test('preserves CRUD, validation, errors and application isolation', async () => {
  const app = await buildApp();
  const otherApp = await buildApp();
  try {
    const payload = { name: ' Alice ', email: 'Alice@example.com' };
    const created = await app.inject({
      method: 'POST',
      url: '/users/',
      payload,
    });
    expect(created.statusCode).toBe(201);
    const user = created.json();
    expect(user).toMatchObject({ name: 'Alice', email: 'alice@example.com' });
    expect((await app.inject('/users/')).json()).toEqual([user]);
    expect((await otherApp.inject('/users/')).json()).toEqual([]);
    const found = await app.inject(`/users/${user.id}`);
    expect(found.statusCode).toBe(200);
    expect(found.json()).toEqual(user);
    const duplicate = await app.inject({
      method: 'POST',
      url: '/users/',
      payload,
    });
    expect(duplicate.statusCode).toBe(409);
    const invalid = await app.inject({
      method: 'POST',
      url: '/users/',
      payload: {},
    });
    expect(invalid.statusCode).toBe(400);
    const updated = await app.inject({
      method: 'PATCH',
      url: `/users/${user.id}`,
      payload: { name: ' Bob ' },
    });
    expect(updated.statusCode).toBe(200);
    expect(updated.json()).toEqual({ ...user, name: 'Bob' });
    const deleted = await app.inject({
      method: 'DELETE',
      url: `/users/${user.id}`,
    });
    expect(deleted.statusCode).toBe(204);
    expect(deleted.body).toBe('');
    expect((await app.inject(`/users/${user.id}`)).statusCode).toBe(404);
    expect((await app.inject('/users/')).json()).toEqual([]);
  } finally {
    await app.close();
    await otherApp.close();
  }
});
