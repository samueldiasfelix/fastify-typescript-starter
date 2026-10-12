import type { FastifyMultipartOptions } from '@fastify/multipart';

export const multipartOptions: FastifyMultipartOptions = {
  attachFieldsToBody: false,
  throwFileSizeLimit: true,
  limits: {
    fieldNameSize: 100,
    fieldSize: 100 * 1024,
    fields: 10,
    fileSize: 10 * 1024 * 1024,
    files: 1,
    parts: 11,
  },
};
