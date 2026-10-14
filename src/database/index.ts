import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { relations } from './relations.js';

export function createDatabase(connectionString: string) {
  const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

  const database = drizzle({ client: pool, relations });

  return { pool, database };
}

export type Database = ReturnType<typeof createDatabase>['database'];
