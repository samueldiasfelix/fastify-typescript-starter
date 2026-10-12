import { randomUUID } from 'node:crypto';
import { UserEmailAlreadyExistsError } from './user.error.js';
import type {
  CreateUserInput,
  ListUsersQuery,
  UpdateUserInput,
  User,
} from './user.schema.js';

export interface UserRepository {
  findAll(query: ListUsersQuery): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  update(id: string, input: UpdateUserInput): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

// Adapter temporário: os dados existem apenas durante a execução deste processo.
export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  async findAll({ limit, offset }: ListUsersQuery): Promise<User[]> {
    return Array.from(this.users.values())
      .slice(offset, offset + limit)
      .map((user) => ({ ...user }));
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user ? { ...user } : null;
  }

  async create(input: CreateUserInput): Promise<User> {
    this.assertUniqueEmail(input.email);
    const user: User = { ...input, id: randomUUID() };
    this.users.set(user.id, user);
    return { ...user };
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    const existing = this.users.get(id);
    if (!existing) return null;

    const user = { ...existing, ...input };
    this.assertUniqueEmail(user.email, id);
    this.users.set(id, user);
    return { ...user };
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Verificação e gravação não têm await entre si: a operação é atômica neste processo.
  private assertUniqueEmail(email: string, excludedId?: string): void {
    for (const user of this.users.values()) {
      if (user.email === email && user.id !== excludedId) {
        throw new UserEmailAlreadyExistsError();
      }
    }
  }
}
