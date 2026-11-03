import { z } from 'zod';

export const envSchema = z.object({
  // Application
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  HOST: z.string().min(1).default('127.0.0.1'),

  PORT: z.coerce.number().int().min(0).max(65_535).default(3000),

  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),

  // Proxy
  TRUST_PROXY: z.string().default(''),

  // CORS
  CORS_ORIGINS: z.string().default(''),

  // Cookies
  COOKIE_SECRET: z.string().min(32),

  // JWT
  JWT_SECRET: z.string().min(32),

  // Database
  DATABASE_URL: z
    .string()
    .min(1)
    .regex(/^postgres(?:ql)?:\/\/\S+$/),

  // Redis
  REDIS_URL: z.string().min(1).default('redis://127.0.0.1:6379'),
});

export const env = envSchema.parse(process.env);
