import type { User } from '../user.entity.js';
import type { ListUsersQuery } from '../user.schema.js';
import type { UserId } from '../value-objects/user-id.js';

export interface UserRepository {
  findAll(query: ListUsersQuery): Promise<User[]>;
  findById(id: UserId): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: UserId): Promise<boolean>;
}
