import rateLimit from '@fastify/rate-limit';
import fp from 'fastify-plugin';
import { rateLimitOptions } from '#/config/rate-limit';

export default fp(
  async function rateLimitPlugin(app) {
    await app.register(rateLimit, {
      ...rateLimitOptions,
      redis: app.redis,
    });
  },
  { name: 'rate-limit', dependencies: ['redis'] },
);
