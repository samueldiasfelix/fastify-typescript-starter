# Fastify TypeScript Starter

A Fastify + TypeScript API starter with PostgreSQL, Redis and a domain-oriented module layout.

> [!WARNING]
> **Work in progress.** This project is under active development and is not ready for production use. APIs, structure and configuration may change without notice.

## Tech stack

- Node.js >= 24.14.0, TypeScript
- [Fastify](https://fastify.dev) 5 with [Zod](https://zod.dev) 4 (`@fastify/type-provider-zod`)
- [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL 18
- Redis + [BullMQ](https://bullmq.io) for queues
- [Awilix](https://github.com/jeffijoe/awilix) for dependency injection
- Swagger + [Scalar](https://scalar.com) API reference
- [Vitest](https://vitest.dev) for tests, [Biome](https://biomejs.dev) for lint/format

## Getting started

1. Create your environment file and fill in the secrets:

   ```sh
   cp .env.example .env
   openssl rand -hex 32   # use the output for COOKIE_SECRET and JWT_SECRET
   ```

2. Run with Docker (starts `db`, `redis` and `api`):

   ```sh
   docker compose up -d --build
   ```

   Or run locally. This needs PostgreSQL and Redis running, and `DATABASE_URL`
   pointing to `localhost` (`.env.example` uses the compose host `db`):

   ```sh
   npm install
   npm run dev
   ```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the server in watch mode |
| `npm run build` | Compile with `tsc` to `dist/` |
| `npm start` | Run the compiled server |
| `npm run typecheck` | Type-check without emitting |
| `npm run format` | Format with Biome |
| `npm run check` | Biome check (lint + format) with fixes |
| `npm run lint` | Biome lint with fixes |
| `npm test` | Vitest in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run db:push` | Push the schema to the database |
| `npm run db:generate` | Generate migrations |
| `npm run db:migrate` | Apply migrations |
| `npm run db:studio` | Open Drizzle Studio |

## Environment variables

Validated with Zod in `src/config/env.ts`.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `NODE_ENV` | no | `development` | `development`, `production` or `test` |
| `HOST` | no | `127.0.0.1` | Bind address |
| `PORT` | no | `3000` | Listen port |
| `LOG_LEVEL` | no | `info` | `fatal`, `error`, `warn`, `info`, `debug`, `trace` or `silent` |
| `TRUST_PROXY` | no | empty | Trusted proxy IPs/CIDRs, comma separated |
| `CORS_ORIGINS` | no | empty | Allowed origins, comma separated |
| `COOKIE_SECRET` | yes | none | At least 32 characters |
| `JWT_SECRET` | yes | none | At least 32 characters |
| `DATABASE_URL` | yes | none | `postgres://` or `postgresql://` URL |
| `REDIS_URL` | no | `redis://127.0.0.1:6379` | Redis connection URL |

## Project structure

```
src/
  app.ts, server.ts, container.ts   # app factory, entrypoint, DI composition root
  config/                           # env and plugin configuration
  plugins/                          # Fastify plugins (autoloaded)
  common/                           # shared errors, hooks, schemas, utils
  database/                         # Drizzle schemas, columns, relations
  modules/
    users/                          # entity, value objects, mapper, repositories,
                                    # service, controller, routes
  providers/                        # mail, queue, storage
tests/
  unit/  integration/  e2e/
```

## Status and known issues

- Only the `users` module exists so far.
- `src/container.ts` still imports the removed in-memory user repository, so `npm run typecheck` currently fails.
- The `Dockerfile` copies `package-lock.json`, but the repository ships a `bun.lock`.
