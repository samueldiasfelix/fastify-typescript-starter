import type {
  CreateCustomerInput,
  Customer,
  ListCustomersQuery,
  UpdateCustomerInput,
} from '../customer.schema.js';

export interface CustomerRepository {
  findAll(query: ListCustomersQuery): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
  create(input: CreateCustomerInput): Promise<Customer>;
  update(id: string, input: UpdateCustomerInput): Promise<Customer | null>;
  delete(id: string): Promise<boolean>;
}
