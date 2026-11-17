import { desc, eq } from 'drizzle-orm';
import type { Database } from '#/database/index';
import { users } from '#/database/schemas/users';
import type { User } from '../user.entity.js';
import { toEntity, toPersistence } from '../user.mapper.js';
import type { ListUsersQuery } from '../user.schema.js';
import type { UserId } from '../value-objects/user-id.js';
import type { UserRepository } from './user.repository.js';

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly db: Database) {}

  async findAll(query: ListUsersQuery): Promise<User[]> {
    const rows = await this.db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt), desc(users.id))
      .limit(query.limit)
      .offset(query.offset);

    return rows.map(toEntity);
  }

  async findById(id: UserId): Promise<User | null> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id.value))
      .limit(1);

    return row ? toEntity(row) : null;
  }

  async save(user: User): Promise<User> {
    const values = toPersistence(user);
    const { id: _id, createdAt: _createdAt, ...changes } = values;

    const [row] = await this.db
      .insert(users)
      .values(values)
      .onConflictDoUpdate({ target: users.id, set: changes })
      .returning();

    if (!row) throw new Error('Failed to save user');
    return toEntity(row);
  }

  async delete(id: UserId): Promise<boolean> {
    const deleted = await this.db
      .delete(users)
      .where(eq(users.id, id.value))
      .returning({ id: users.id });

    return deleted.length > 0;
  }
}
