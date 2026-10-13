import { asClass } from 'awilix';
import { defineModule } from '../../shared/awilix/define-module.js';
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

export default defineModule({
  prefix: '/users',
  providers: {
    userRepository: asClass(InMemoryUserRepository).singleton(),
    userService: asClass(UserService).singleton(),
    userController: asClass(UserController).singleton(),
    userRoutes: asClass(UserRoutes).singleton(),
  },
  routes: 'userRoutes',
});
