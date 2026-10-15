import type { Cradle } from '@fastify/awilix';
import {
  createContainer,
  InjectionMode,
  type NameAndRegistrationPair,
} from 'awilix';

import { customerDependencies } from '#/modules/customers/customer.module';
import { userDependencies } from '#/modules/users/user.module';

export type ContainerOverrides = NameAndRegistrationPair<Cradle>;

/**
 * Composition root: cada módulo declara as próprias dependências e aqui elas
 * são compostas. Um container novo por chamada isola o estado entre instâncias
 * de `buildApp()` (os repositórios em memória são singletons).
 *
 * Modo CLASSIC: os nomes dos parâmetros dos construtores devem corresponder
 * aos registros do container (ex.: `constructor(userRepository)`).
 */
export function createDiContainer(overrides: ContainerOverrides = {}) {
  return createContainer<Cradle>({ injectionMode: InjectionMode.CLASSIC })
    .register(userDependencies)
    .register(customerDependencies)
    .register(overrides);
}
