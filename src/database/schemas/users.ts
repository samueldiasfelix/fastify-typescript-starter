import { sql } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export type Role = 'customer' | 'staff' | 'admin';

export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),

  email: text().notNull().unique(),

  emailVerified: boolean('email_verified').notNull().default(false),

  passwordHash: text('password_hash'),

  roles: text()
    .array()
    .$type<Role[]>()
    .notNull()
    .default(sql`'{customer}'::text[]`),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
