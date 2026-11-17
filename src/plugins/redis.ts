import redis from '@fastify/redis';
import fp from 'fastify-plugin';
import { redisOptions } from '#/config/redis';

export default fp(
  async function redisPlugin(app) {
    await app.register(redis, redisOptions);
  },
  { name: 'redis' },
);
