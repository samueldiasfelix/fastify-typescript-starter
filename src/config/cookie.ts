import type { FastifyCookieOptions } from '@fastify/cookie';
import { env } from '#/config/env';
import { isProduction } from '#/shared/utils/env';

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
