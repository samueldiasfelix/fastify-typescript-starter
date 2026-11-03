import type { FastifyCookieOptions } from '@fastify/cookie';
import { env } from '#/config/env';
import { isProduction } from '../common/utils/env.js';

export const cookieOptions: FastifyCookieOptions = {
  secret: env.COOKIE_SECRET,
  hook: 'onRequest',
  parseOptions: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  },
};
