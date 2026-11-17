import { defineConfig } from 'drizzle-kit';
import { env } from './src/config/env.js';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schemas/*.ts',
  out: './drizzle/migrations',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
