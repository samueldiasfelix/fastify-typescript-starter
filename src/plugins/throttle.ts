import throttle from '@fastify/throttle';
import fp from 'fastify-plugin';
import { throttleOptions } from '#/config/throttle';

export default fp(
  async function throttlePlugin(app) {
    await app.register(throttle, throttleOptions);
  },
  { name: 'throttle' },
);
