import type { FastifyCorsOptions } from '@fastify/cors';
import { env } from '#/config/env';

export const corsOptions: FastifyCorsOptions = {
  origin: env.CORS_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  credentials: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  // Lets browser clients read how long to wait after a 429/503.
  exposedHeaders: ['retry-after'],
  maxAge: 600,
};
