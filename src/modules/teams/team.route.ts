import type { FastifyPluginAsyncZod } from '@fastify/type-provider-zod';
import type { TeamController } from './team.controller.js';

export class TeamRoutes {
  constructor(private readonly teamController: TeamController) {}

  register: FastifyPluginAsyncZod = async (app) => {
    //
  };
}
