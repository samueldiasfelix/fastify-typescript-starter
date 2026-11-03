import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import type { TeamController } from './team.controller.js';

export class TeamRoutes {
  constructor(private readonly teamController: TeamController) {}

  register: FastifyPluginAsyncTypebox = async (app) => {
    //
  };
}
