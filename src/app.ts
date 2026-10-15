import { join } from 'node:path';
import autoload from '@fastify/autoload';
import { fastifyAwilixPlugin } from '@fastify/awilix';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastify from 'fastify';

import { env } from '#/config/env';
import { loggerOptions } from '#/config/logger';
import { type ContainerOverrides, createDiContainer } from '#/container';

export async function buildApp(overrides: ContainerOverrides = {}) {
  const app = fastify({
    logger: loggerOptions,
    trustProxy: env.TRUST_PROXY,
  }).withTypeProvider<TypeBoxTypeProvider>();

  await app.register(fastifyAwilixPlugin, {
    container: createDiContainer(overrides),
    disposeOnClose: true,
    disposeOnResponse: true,
  });

  await app.register(autoload, {
    dir: join(import.meta.dirname, 'plugins'),
  });

  await app.register(app.diContainer.resolve('userRoutes').register, {
    prefix: '/users',
  });
  await app.register(app.diContainer.resolve('customerRoutes').register, {
    prefix: '/customers',
  });

  return app;
}
