import swagger from '@fastify/swagger';
import scalar from '@scalar/fastify-api-reference';
import fp from 'fastify-plugin';
import { scalarOptions, swaggerOptions } from '#/config/swagger';

export default fp(
  async function swaggerPlugin(app) {
    await app.register(swagger, swaggerOptions);
    await app.register(scalar, scalarOptions);
  },
  { name: 'swagger' },
);
