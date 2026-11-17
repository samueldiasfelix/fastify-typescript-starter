import { randomUUIDv7 } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import type { RoleValue } from '#/modules/users/value-objects/role';
import { timestamps } from '../columns/timestamps.js';

export const users = pgTable('users', {
  id: uuid().primaryKey().$defaultFn(randomUUIDv7),

  name: text().notNull(),

  email: text().notNull().unique(),

  emailVerified: boolean('email_verified').notNull().default(false),

  passwordHash: text('password_hash'),

  roles: text()
    .$type<RoleValue>()
    .array()
    .notNull()
    .default(sql`'{customer}'::text[]`),

  ...timestamps({ softDelete: true }),
});

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
