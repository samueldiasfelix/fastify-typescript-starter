import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
  CreateCustomerInput,
  CustomerParams,
  ListCustomersQuery,
  UpdateCustomerInput,
} from './customer.schema.js';

import type { CustomerService } from './customer.service.js';

export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  list = async (
    request: FastifyRequest<{ Querystring: ListCustomersQuery }>,
    reply: FastifyReply,
  ) => {
    return reply.send(await this.customerService.list(request.query));
  };

  getById = async (
    request: FastifyRequest<{ Params: CustomerParams }>,
    reply: FastifyReply,
  ) => {
    return reply.send(await this.customerService.getById(request.params.id));
  };

  create = async (
    request: FastifyRequest<{ Body: CreateCustomerInput }>,
    reply: FastifyReply,
  ) => {
    const customer = await this.customerService.create(request.body);
    return reply.code(201).send(customer);
  };

  update = async (
    request: FastifyRequest<{
      Params: CustomerParams;
      Body: UpdateCustomerInput;
    }>,
    reply: FastifyReply,
  ) => {
    return reply.send(
      await this.customerService.update(request.params.id, request.body),
    );
  };

  delete = async (
    request: FastifyRequest<{ Params: CustomerParams }>,
    reply: FastifyReply,
  ) => {
    await this.customerService.delete(request.params.id);
    return reply.code(204).send();
  };
}
