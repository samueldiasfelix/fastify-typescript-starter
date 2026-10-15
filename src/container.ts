import type { Cradle } from '@fastify/awilix';
import {
  asClass,
  createContainer,
  InjectionMode,
  type NameAndRegistrationPair,
} from 'awilix';

import { CustomerController } from '#/modules/customers/customer.controller';
import {
  type CustomerRepository,
  InMemoryCustomerRepository,
} from '#/modules/customers/customer.repository';
import { CustomerRoutes } from '#/modules/customers/customer.route';
import { CustomerService } from '#/modules/customers/customer.service';
import { UserController } from '#/modules/users/user.controller';
import {
  InMemoryUserRepository,
  type UserRepository,
} from '#/modules/users/user.repository';
import { UserRoutes } from '#/modules/users/user.route';
import { UserService } from '#/modules/users/user.service';

declare module '@fastify/awilix' {
  interface Cradle {
    userRepository: UserRepository;
    userService: UserService;
    userController: UserController;
    userRoutes: UserRoutes;
    customerRepository: CustomerRepository;
    customerService: CustomerService;
    customerController: CustomerController;
    customerRoutes: CustomerRoutes;
  }
}

export type ContainerOverrides = NameAndRegistrationPair<Cradle>;

/**
 * Composition root: todas as dependências dos módulos são compostas aqui.
 * Um container novo por chamada isola o estado entre instâncias
 * de `buildApp()` (os repositórios em memória são singletons).
 *
 * Modo CLASSIC: os nomes dos parâmetros dos construtores devem corresponder
 * aos registros do container (ex.: `constructor(userRepository)`).
 */
export function createDiContainer(overrides: ContainerOverrides = {}) {
  return createContainer<Cradle>({ injectionMode: InjectionMode.CLASSIC })
    .register({
      userRepository: asClass(InMemoryUserRepository).singleton(),
      userService: asClass(UserService).singleton(),
      userController: asClass(UserController).singleton(),
      userRoutes: asClass(UserRoutes).singleton(),
      customerRepository: asClass(InMemoryCustomerRepository).singleton(),
      customerService: asClass(CustomerService).singleton(),
      customerController: asClass(CustomerController).singleton(),
      customerRoutes: asClass(CustomerRoutes).singleton(),
    })
    .register(overrides);
}
