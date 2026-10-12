import type { FastifyThrottleOptions } from '@fastify/throttle';

export const throttleOptions: FastifyThrottleOptions = {
  bytesPerSecond: 1024 * 1024,
  streamPayloads: true,
  bufferPayloads: false,
  stringPayloads: false,
  async: false,
};
