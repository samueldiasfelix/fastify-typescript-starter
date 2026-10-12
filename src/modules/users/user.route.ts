import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import type { UserController } from './user.controller.js';
import {
  createUserSchema,
  listUsersQuerySchema,
  updateUserSchema,
  userListSchema,
  userParamsSchema,
  userSchema,
} from './user.schema.js';

type Dependencies = { userController: UserController };

export class UserRoutes {
  private readonly controller: UserController;

  constructor({ userController }: Dependencies) {
    this.controller = userController;
  }

  register: FastifyPluginAsyncTypebox = async (app) => {
    app.get(
      '/',
      {
        schema: {
          tags: ['Users'],
          operationId: 'listUsers',
          summary: 'Listar usuários',
          querystring: listUsersQuerySchema,
          response: { 200: userListSchema },
        },
      },
      this.controller.list,
    );

    app.get(
      '/:id',
      {
        schema: {
          tags: ['Users'],
          operationId: 'getUserById',
          summary: 'Buscar usuário',
          params: userParamsSchema,
          response: { 200: userSchema },
        },
      },
      this.controller.getById,
    );

    app.post(
      '/',
      {
        schema: {
          tags: ['Users'],
          operationId: 'createUser',
          summary: 'Criar usuário',
          body: createUserSchema,
          response: { 201: userSchema },
        },
      },
      this.controller.create,
    );

    app.patch(
      '/:id',
      {
        schema: {
          tags: ['Users'],
          operationId: 'updateUser',
          summary: 'Atualizar usuário',
          params: userParamsSchema,
          body: updateUserSchema,
          response: { 200: userSchema },
        },
      },
      this.controller.update,
    );

    app.delete(
      '/:id',
      {
        schema: {
          tags: ['Users'],
          operationId: 'deleteUser',
          summary: 'Excluir usuário',
          params: userParamsSchema,
        },
      },
      this.controller.delete,
    );
  };
}
