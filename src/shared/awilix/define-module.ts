import type { Cradle } from '@fastify/awilix';
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import type { NameAndRegistrationPair } from 'awilix';

type App = Parameters<FastifyPluginAsyncTypebox>[0];
type MountRoutes = (app: App) => Promise<void>;

type RoutesKey = {
  [K in keyof Cradle]: Cradle[K] extends {
    register: FastifyPluginAsyncTypebox;
  }
    ? K
    : never;
}[keyof Cradle];

type ModuleDefinition = {
  prefix: string;
  providers: NameAndRegistrationPair<Cradle>;
  routes: RoutesKey;
};

// Um container por app, então não há vazamento de estado entre apps/testes.
const pendingMounts = new WeakMap<object, MountRoutes[]>();

export function defineModule({
  prefix,
  providers,
  routes,
}: ModuleDefinition): FastifyPluginAsyncTypebox {
  return async (app) => {
    // Awilix sobrescreve registros duplicados em silêncio. Com 15 módulos isso é um risco real.
    for (const name of Object.keys(providers)) {
      if (app.diContainer.hasRegistration(name)) {
        throw new Error(`DI: "${name}" já está registrado por outro módulo`);
      }
    }

    app.diContainer.register(providers);

    const mounts = pendingMounts.get(app.diContainer) ?? [];
    mounts.push(async (root) => {
      const { register } = root.diContainer.resolve(routes);
      await root.register(register, { prefix });
    });
    pendingMounts.set(app.diContainer, mounts);
  };
}

export const mountModuleRoutes: FastifyPluginAsyncTypebox = async (app) => {
  const mounts = pendingMounts.get(app.diContainer);
  if (!mounts?.length) {
    throw new Error('DI: nenhum módulo registrado. Verifique o autoload.');
  }

  for (const mount of mounts) {
    await mount(app);
  }
};
