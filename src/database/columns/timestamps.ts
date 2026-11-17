import { timestamp } from 'drizzle-orm/pg-core';

const timestamptz = (name: string) => timestamp(name, { withTimezone: true });

const createdUpdated = () => ({
  createdAt: timestamptz('created_at').notNull().defaultNow(),
  updatedAt: timestamptz('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

const deleted = () => ({
  deletedAt: timestamptz('deleted_at'),
});

/**
 * `created_at` e `updated_at`; com `{ softDelete: true }` inclui `deleted_at` (nulável).
 * Espalhe na tabela: `...timestamps()`.
 */
export function timestamps(options?: { softDelete?: false }): ReturnType<typeof createdUpdated>;
export function timestamps(options: { softDelete: true }): ReturnType<typeof createdUpdated> & ReturnType<typeof deleted>;
export function timestamps(options: { softDelete?: boolean } = {}) {
  return options.softDelete
    ? { ...createdUpdated(), ...deleted() }
    : createdUpdated();
}
