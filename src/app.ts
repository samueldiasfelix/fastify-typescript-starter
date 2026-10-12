import { join } from 'node:path';
import autoload from '@fastify/autoload';
import { fastifyAwilixPlugin } from '@fastify/awilix';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastify from 'fastify';

import { env } from '#/config/env';
import { loggerOptions } from '#/config/logger';
import { createAppContainer } from '#/container';

export async function buildApp() {
  const app = fastify({
    logger: loggerOptions,
    trustProxy: env.TRUST_PROXY,
  }).withTypeProvider<TypeBoxTypeProvider>();

  await app.register(fastifyAwilixPlugin, {
    container: createAppContainer(),
    disposeOnClose: true,
    disposeOnResponse: true,
  });

  await app.register(autoload, {
    dir: join(import.meta.dirname, 'plugins'),
  });

  await app.register(autoload, {
    dir: join(import.meta.dirname, 'modules'),
    matchFilter: /\.module\.(ts|js)$/,
    dirNameRoutePrefix: false,
    maxDepth: 1,
  });

  return app;
}
