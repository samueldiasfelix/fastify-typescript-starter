import { defineRelations } from 'drizzle-orm';
import { schemas } from './schemas.js';

export const relations = defineRelations(schemas, (r) => ({
  users: {
    assets: r.many.assets(),
    projects: r.many.projects(),
  },

  projects: {
    user: r.one.users({
      from: r.projects.userId,
      to: r.users.id,
    }),

    assets: r.many.assets(),
  },

  assets: {
    user: r.one.users({
      from: r.assets.userId,
      to: r.users.id,
    }),

    project: r.one.projects({
      from: r.assets.projectId,
      to: r.projects.id,
    }),
  },
}));
