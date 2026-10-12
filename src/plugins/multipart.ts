import multipart from '@fastify/multipart';
import fp from 'fastify-plugin';
import { multipartOptions } from '#/config/multipart';

export default fp(
  async function multipartPlugin(app) {
    await app.register(multipart, multipartOptions);
  },
  { name: 'multipart' },
);
