import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
  CreateUserInput,
  ListUsersQuery,
  UpdateUserInput,
  UserParams,
} from './user.schema.js';

import type { UserService } from './user.service.js';

type Dependencies = { userService: UserService };

export class UserController {
  private readonly service: UserService;

  constructor({ userService }: Dependencies) {
    this.service = userService;
  }
  list = async (
    request: FastifyRequest<{ Querystring: ListUsersQuery }>,
    reply: FastifyReply,
  ) => {
    return reply.send(await this.service.list(request.query));
  };

  getById = async (
    request: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply,
  ) => {
    return reply.send(await this.service.getById(request.params.id));
  };

  create = async (
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply,
  ) => {
    const user = await this.service.create(request.body);
    return reply.code(201).send(user);
  };

  update = async (
    request: FastifyRequest<{ Params: UserParams; Body: UpdateUserInput }>,
    reply: FastifyReply,
  ) => {
    return reply.send(
      await this.service.update(request.params.id, request.body),
    );
  };

  delete = async (
    request: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply,
  ) => {
    await this.service.delete(request.params.id);
    return reply.code(204).send();
  };
}
