import { join } from 'node:path';
import autoload from '@fastify/autoload';
import { type Cradle, fastifyAwilixPlugin } from '@fastify/awilix';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { NameAndRegistrationPair } from 'awilix';
import fastify from 'fastify';

import { env } from '#/config/env';
import { loggerOptions } from '#/config/logger';
import { createAppContainer } from '#/container';
import { mountModuleRoutes } from '#/shared/awilix/define-module';

type BuildAppOptions = {
  /** Substitui providers (ex.: repositório fake) em testes de integração. */
  overrides?: NameAndRegistrationPair<Cradle>;
};

export async function buildApp({ overrides }: BuildAppOptions = {}) {
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

  // Depois dos módulos (para sobrescrever) e antes de montar as rotas (para valer).
  if (overrides) app.diContainer.register(overrides);

  await app.register(mountModuleRoutes);

  return app;
}
