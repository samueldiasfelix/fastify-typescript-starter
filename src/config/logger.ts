import type { PinoLoggerOptions } from 'fastify/types/logger.js';
import { env } from '#/config/env';
import { isDevelopment } from '#/shared/utils/env';

export const loggerOptions: PinoLoggerOptions = {
  level: env.LOG_LEVEL,

  //   base: {
  //     service: env.OTEL_SERVICE_NAME,
  //   },

  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
    ],
    censor: '[REDACTED]',
  },

  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
};
