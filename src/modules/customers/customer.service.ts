import type { UserService } from '../users/user.service.js';
import { CustomerNotFoundError } from './customer.error.js';
import type { CustomerRepository } from './customer.repository.js';
import type {
  CreateCustomerInput,
  Customer,
  ListCustomersQuery,
  UpdateCustomerInput,
} from './customer.schema.js';

export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly userService: Pick<UserService, 'getById'>,
  ) {}

  list(query: ListCustomersQuery): Promise<Customer[]> {
    return this.customerRepository.findAll(query);
  }

  async getById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) throw new CustomerNotFoundError();
    return customer;
  }

  async create(input: CreateCustomerInput): Promise<Customer> {
    await this.userService.getById(input.userId);
    return this.customerRepository.create({ userId: input.userId });
  }

  async update(id: string, input: UpdateCustomerInput): Promise<Customer> {
    await this.getById(id);
    const changes: UpdateCustomerInput = {};
    if (input.userId !== undefined) {
      await this.userService.getById(input.userId);
      changes.userId = input.userId;
    }

    const customer = await this.customerRepository.update(id, changes);
    if (!customer) throw new CustomerNotFoundError();
    return customer;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.customerRepository.delete(id);
    if (!deleted) throw new CustomerNotFoundError();
  }
}
