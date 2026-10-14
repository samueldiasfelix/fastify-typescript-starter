import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { asClass } from 'awilix';
import { UserController } from './user.controller.js';
import {
  InMemoryUserRepository,
  type UserRepository,
} from './user.repository.js';
import { UserRoutes } from './user.route.js';
import { UserService } from './user.service.js';

declare module '@fastify/awilix' {
  interface Cradle {
    userRepository: UserRepository;
    userService: UserService;
    userController: UserController;
  }
}

export const userDependencies = {
  userRepository: asClass(InMemoryUserRepository).singleton(),
  userService: asClass(UserService).singleton(),
  userController: asClass(UserController).singleton(),
};

const userModule: FastifyPluginAsyncTypebox = async (app) => {
  const userRoutes = new UserRoutes(app.diContainer.resolve('userController'));

  await app.register(userRoutes.register);
};

export default userModule;
