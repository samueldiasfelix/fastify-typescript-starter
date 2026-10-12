import type { FastifySessionOptions } from '@fastify/session';
import { env } from '#/config/env';
import { isProduction } from '#/shared/utils/env';

export const SESSION_TTL = 60 * 60 * 24 * 7; // 7 dias

export const sessionOptions: FastifySessionOptions = {
  secret: env.COOKIE_SECRET,

  cookieName: isProduction ? '__Host-session' : 'session',

  saveUninitialized: false,
  rolling: true,

  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL * 1000,
  },
};
