import type { FastifyPluginAsyncZod } from '@fastify/type-provider-zod';
import type { CustomerController } from './customer.controller.js';
import {
  createCustomerSchema,
  customerListSchema,
  customerParamsSchema,
  customerSchema,
  listCustomersQuerySchema,
  updateCustomerSchema,
} from './customer.schema.js';

export class CustomerRoutes {
  constructor(private readonly customerController: CustomerController) {}

  register: FastifyPluginAsyncZod = async (app) => {
    app.get(
      '/',
      {
        schema: {
          tags: ['Customers'],
          operationId: 'listCustomers',
          summary: 'Listar clientes',
          querystring: listCustomersQuerySchema,
          response: { 200: customerListSchema },
        },
      },
      this.customerController.list,
    );

    app.get(
      '/:id',
      {
        schema: {
          tags: ['Customers'],
          operationId: 'getCustomerById',
          summary: 'Buscar cliente',
          params: customerParamsSchema,
          response: { 200: customerSchema },
        },
      },
      this.customerController.getById,
    );

    app.post(
      '/',
      {
        schema: {
          tags: ['Customers'],
          operationId: 'createCustomer',
          summary: 'Criar cliente',
          body: createCustomerSchema,
          response: { 201: customerSchema },
        },
      },
      this.customerController.create,
    );

    app.patch(
      '/:id',
      {
        schema: {
          tags: ['Customers'],
          operationId: 'updateCustomer',
          summary: 'Atualizar cliente',
          params: customerParamsSchema,
          body: updateCustomerSchema,
          response: { 200: customerSchema },
        },
      },
      this.customerController.update,
    );

    app.delete(
      '/:id',
      {
        schema: {
          tags: ['Customers'],
          operationId: 'deleteCustomer',
          summary: 'Excluir cliente',
          params: customerParamsSchema,
        },
      },
      this.customerController.delete,
    );
  };
}
