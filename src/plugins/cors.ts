import cors from '@fastify/cors';
import fp from 'fastify-plugin';
import { corsOptions } from '#/config/cors';

export default fp(
  async function corsPlugin(app) {
    await app.register(cors, corsOptions);
  },
  { name: 'cors' },
);
