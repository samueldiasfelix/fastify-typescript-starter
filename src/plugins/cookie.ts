import cookie from '@fastify/cookie';
import fp from 'fastify-plugin';
import { cookieOptions } from '#/config/cookie';

export default fp(
  async function cookiePlugin(app) {
    await app.register(cookie, cookieOptions);
  },
  { name: 'cookie' },
);
