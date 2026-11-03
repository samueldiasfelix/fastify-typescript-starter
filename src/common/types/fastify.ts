import type {
  FastifyReply,
  FastifyRequest,
  RouteGenericInterface,
} from 'fastify';

export type Handler<
  Route extends RouteGenericInterface = RouteGenericInterface,
> = (req: FastifyRequest<Route>, reply: FastifyReply) => Promise<FastifyReply>;
