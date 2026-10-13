import fp from 'fastify-plugin';
import { env } from '#/config/env';
import type { Database } from '#/database/index';
import { createDatabase } from '#/database/index';

declare module 'fastify' {
  interface FastifyInstance {
    db: Database;
  }
}

export default fp(
  async function database(app) {
    const { pool, db } = createDatabase(env.DATABASE_URL);

    pool.on('error', (error) => {
      app.log.error({ err: error }, 'PostgreSQL pool error');
    });

    try {
      await pool.query('SELECT 1');
    } catch (error) {
      await pool.end();
      throw error;
    }

    app.decorate('db', db);

    app.addHook('onClose', async () => {
      await pool.end();
    });
  },
  { name: 'database' },
);
