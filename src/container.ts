import type { Cradle } from '@fastify/awilix';
import { createContainer, InjectionMode } from 'awilix';

export function createAppContainer() {
  return createContainer<Cradle>({
    injectionMode: InjectionMode.PROXY,
    strict: true,
  });
}
