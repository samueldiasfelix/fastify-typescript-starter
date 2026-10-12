import type { FastifyRedisPluginOptions } from '@fastify/redis';
import { env } from '#/config/env';

export const redisOptions: FastifyRedisPluginOptions = {
  url: env.REDIS_URL,
  connectTimeout: 5_000,
  maxRetriesPerRequest: 1,
};
