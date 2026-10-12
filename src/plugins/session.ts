import session, { type FastifySessionOptions } from '@fastify/session';
import fp from 'fastify-plugin';
import { SESSION_TTL, sessionOptions } from '#/config/session';

export default fp(
  async function sessionPlugin(app) {
    const prefix = 'session:';

    const store: NonNullable<FastifySessionOptions['store']> = {
      set(sessionId, data, callback) {
        void Promise.resolve()
          .then(() =>
            app.redis.set(
              `${prefix}${sessionId}`,
              JSON.stringify(data),
              'EX',
              SESSION_TTL,
            ),
          )
          .then(
            () => callback(),
            (error: Error) => callback(error),
          );
      },

      get(sessionId, callback) {
        void app.redis
          .get(`${prefix}${sessionId}`)
          .then((data) => {
            callback(null, data === null ? null : JSON.parse(data));
          })
          .catch((error: Error) => callback(error));
      },

      destroy(sessionId, callback) {
        void app.redis.del(`${prefix}${sessionId}`).then(
          () => callback(),
          (error: Error) => callback(error),
        );
      },
    };

    await app.register(session, {
      ...sessionOptions,
      store,
    });
  },
  {
    name: 'session',
    dependencies: ['cookie', 'redis'],
  },
);
