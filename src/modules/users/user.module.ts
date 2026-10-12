import { asClass } from 'awilix';
import type { FastifyPluginAsync } from 'fastify';
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
    userRoutes: UserRoutes;
  }
}

const userModule: FastifyPluginAsync = async (app) => {
  app.diContainer.register({
    userRepository: asClass(InMemoryUserRepository).singleton(),
    userService: asClass(UserService).singleton(),
    userController: asClass(UserController).singleton(),
    userRoutes: asClass(UserRoutes).singleton(),
  });

  const userRoutes = app.diContainer.resolve('userRoutes');
  await app.register(userRoutes.register, { prefix: '/users' });
};

export default userModule;
