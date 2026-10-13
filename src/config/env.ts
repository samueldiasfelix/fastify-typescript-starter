import Type from 'typebox';
import Value from 'typebox/value';

export const envSchema = Type.Object({
  // Application
  NODE_ENV: Type.Union(
    [
      Type.Literal('development'),
      Type.Literal('production'),
      Type.Literal('test'),
    ],
    { default: 'development' },
  ),

  HOST: Type.String({
    minLength: 1,
    default: '127.0.0.1',
  }),

  PORT: Type.Integer({
    minimum: 0,
    maximum: 65_535,
    default: 3000,
  }),

  LOG_LEVEL: Type.Union(
    [
      Type.Literal('fatal'),
      Type.Literal('error'),
      Type.Literal('warn'),
      Type.Literal('info'),
      Type.Literal('debug'),
      Type.Literal('trace'),
      Type.Literal('silent'),
    ],
    { default: 'info' },
  ),

  // Proxy
  TRUST_PROXY: Type.String({
    default: '',
  }),

  // CORS
  CORS_ORIGINS: Type.String({
    default: '',
  }),

  // Cookies
  COOKIE_SECRET: Type.String({
    minLength: 32,
  }),

  // JWT
  JWT_SECRET: Type.String({
    minLength: 32,
  }),

  // Redis
  DATABASE_URL: Type.String({
    minLength: 1,
    pattern: '^postgres(?:ql)?:\\/\\/[^\\s]+$',
  }),

  // Redis
  REDIS_URL: Type.String({
    minLength: 1,
    default: 'redis://127.0.0.1:6379',
  }),
});

export type Env = Type.Static<typeof envSchema>;

export function parseEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const value = Value.Convert(
    envSchema,
    Value.Default(envSchema, Value.Clean(envSchema, { ...source })),
  );

  if (!Value.Check(envSchema, value)) {
    const details = Value.Errors(envSchema, value)
      .map((error) => `  ${error.instancePath || '/'}: ${error.message}`)
      .join('\n');

    throw new Error(`Invalid environment variables:\n${details}`);
  }

  return value;
}

export const env = parseEnv();
