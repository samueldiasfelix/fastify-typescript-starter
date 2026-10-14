import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { asClass } from 'awilix';
import { CustomerController } from './customer.controller.js';
import {
  type CustomerRepository,
  InMemoryCustomerRepository,
} from './customer.repository.js';
import { CustomerRoutes } from './customer.route.js';
import { CustomerService } from './customer.service.js';

declare module '@fastify/awilix' {
  interface Cradle {
    customerRepository: CustomerRepository;
    customerService: CustomerService;
    customerController: CustomerController;
  }
}

export const customerDependencies = {
  customerRepository: asClass(InMemoryCustomerRepository).singleton(),
  customerService: asClass(CustomerService).singleton(),
  customerController: asClass(CustomerController).singleton(),
};

const customerModule: FastifyPluginAsyncTypebox = async (app) => {
  const customerRoutes = new CustomerRoutes(
    app.diContainer.resolve('customerController'),
  );

  await app.register(customerRoutes.register);
};

export default customerModule;
