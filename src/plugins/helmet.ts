import helmet from '@fastify/helmet';
import fp from 'fastify-plugin';
import { helmetOptions } from '#/config/helmet';

export default fp(
  async function helmetPlugin(app) {
    await app.register(helmet, helmetOptions);
  },
  { name: 'helmet' },
);
