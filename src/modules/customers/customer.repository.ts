import { randomUUID } from 'node:crypto';
import type {
  CreateCustomerInput,
  Customer,
  ListCustomersQuery,
  UpdateCustomerInput,
} from './customer.schema.js';

export interface CustomerRepository {
  findAll(query: ListCustomersQuery): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
  create(input: CreateCustomerInput): Promise<Customer>;
  update(id: string, input: UpdateCustomerInput): Promise<Customer | null>;
  delete(id: string): Promise<boolean>;
}

// Adapter temporário: os dados existem apenas durante a execução deste processo.
export class InMemoryCustomerRepository implements CustomerRepository {
  private readonly customers = new Map<string, Customer>();

  async findAll({ limit, offset }: ListCustomersQuery): Promise<Customer[]> {
    return Array.from(this.customers.values())
      .slice(offset, offset + limit)
      .map((customer) => ({ ...customer }));
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = this.customers.get(id);
    return customer ? { ...customer } : null;
  }

  async create(input: CreateCustomerInput): Promise<Customer> {
    const customer: Customer = { ...input, id: randomUUID() };
    this.customers.set(customer.id, customer);
    return { ...customer };
  }

  async update(
    id: string,
    input: UpdateCustomerInput,
  ): Promise<Customer | null> {
    const existing = this.customers.get(id);
    if (!existing) return null;

    const customer = { ...existing, ...input };
    this.customers.set(id, customer);
    return { ...customer };
  }

  async delete(id: string): Promise<boolean> {
    return this.customers.delete(id);
  }
}
