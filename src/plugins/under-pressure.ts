import underPressure from '@fastify/under-pressure';
import fp from 'fastify-plugin';
import { underPressureOptions } from '#/config/under-pressure';

export default fp(
  async function underPressurePlugin(app) {
    await app.register(underPressure, underPressureOptions);
  },
  { name: 'under-pressure' },
);
