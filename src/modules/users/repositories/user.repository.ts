import type {
  CreateUserInput,
  ListUsersQuery,
  UpdateUserInput,
  User,
} from '../user.schema.js';

export interface UserRepository {
  findAll(query: ListUsersQuery): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  update(id: string, input: UpdateUserInput): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
