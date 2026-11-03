import { desc, eq } from 'drizzle-orm';
import type { Database } from '#/database/index';
import { users } from '#/database/schemas/users';
import type { UserRepository } from '../user.repository.js';
import type {
  CreateUserInput,
  ListUsersQuery,
  UpdateUserInput,
  User,
} from '../user.schema.js';

const userSelection = {
  id: users.id,
  name: users.name,
  email: users.email,
};

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly db: Database) {}

  async findAll(query: ListUsersQuery): Promise<User[]> {
    return this.db
      .select(userSelection)
      .from(users)
      .orderBy(desc(users.createdAt), desc(users.id))
      .limit(query.limit)
      .offset(query.offset);
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await this.db
      .select(userSelection)
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user ?? null;
  }

  async create(input: CreateUserInput): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values({
        name: input.name,
        email: input.email,
      })
      .returning(userSelection);

    if (!user) {
      throw new Error('Failed to create user');
    }

    return user;
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    const [user] = await this.db
      .update(users)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning(userSelection);

    return user ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
      });

    return deleted.length > 0;
  }
}
