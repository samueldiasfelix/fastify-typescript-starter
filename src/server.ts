// server.ts
import { buildApp } from '#/app';
import { env } from '#/config/env';

const app = await buildApp();

async function shutdown(signal: NodeJS.Signals) {
  app.log.info({ signal }, 'Shutting down server');

  try {
    await app.close();
    process.exit(0);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

try {
  await app.listen({ host: env.HOST, port: env.PORT });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
