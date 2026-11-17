import type { RateLimitPluginOptions } from '@fastify/rate-limit';

export const rateLimitOptions: RateLimitPluginOptions = {
  global: true,
  max: 100,
  timeWindow: 60_000,
  hook: 'onRequest',
  nameSpace: 'app:rate-limit:',
  skipOnError: false,
};
