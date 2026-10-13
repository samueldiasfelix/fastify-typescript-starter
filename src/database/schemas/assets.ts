import {
  bigint,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { projects } from './projects.js';
import { users } from './users.js';

export const assetTypeEnum = pgEnum('asset_type', [
  'image',
  'video',
  'audio',
  'font',
]);

export const assets = pgTable(
  'assets',
  {
    id: uuid().primaryKey().defaultRandom(),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),

    projectId: uuid('project_id').references(() => projects.id, {
      onDelete: 'set null',
    }),

    name: text().notNull(),

    originalName: text('original_name').notNull(),

    type: assetTypeEnum().notNull(),

    mimeType: text('mime_type').notNull(),

    size: bigint({
      mode: 'number',
    }).notNull(),

    storageKey: text('storage_key').notNull().unique(),

    width: integer(),

    height: integer(),

    duration: integer(),

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
  },
  (table) => [
    index('assets_user_id_idx').on(table.userId),

    index('assets_project_id_idx').on(table.projectId),

    index('assets_user_type_idx').on(table.userId, table.type),
  ],
);

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
