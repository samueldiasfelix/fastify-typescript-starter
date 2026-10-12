import { randomBytes } from 'node:crypto';
import type { FastifyHelmetOptions } from '@fastify/helmet';

// Nonce gerado a cada start do processo. É compartilhado com o Scalar
// (config/swagger.ts), que injeta um <script> inline na página /reference.
export const cspNonce = randomBytes(16).toString('base64');

export const helmetOptions: FastifyHelmetOptions = {
  contentSecurityPolicy: {
    // Mantém as diretivas padrão do helmet e só amplia o script-src
    directives: {
      scriptSrc: ["'self'", `'nonce-${cspNonce}'`],
    },
  },
};
