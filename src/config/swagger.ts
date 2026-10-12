import type { SwaggerOptions } from '@fastify/swagger';
import type { FastifyApiReferenceOptions } from '@scalar/fastify-api-reference';
import { cspNonce } from '#/config/helmet';

export const swaggerOptions: SwaggerOptions = {
  openapi: {
    openapi: '3.1.0',
    info: {
      title: 'API Server',
      description: 'API Server Documentation',
      version: '1.0.0',
    },
  },
};

export const scalarOptions: FastifyApiReferenceOptions = {
  routePrefix: '/reference',
  // Mesmo nonce do CSP do helmet, para o script inline do Scalar ser permitido
  configuration: { nonce: cspNonce },
};
