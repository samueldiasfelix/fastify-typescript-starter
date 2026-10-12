import '@fastify/session';

declare module 'fastify' {
  interface Session {
    userId?: string;
    createdAt?: number;
    absoluteExpiresAt?: number;
    lastRenewedAt?: number;
  }
}
