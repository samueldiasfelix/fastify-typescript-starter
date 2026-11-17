import { defineRelations } from 'drizzle-orm';
import { schemas } from './schemas.js';

export const relations = defineRelations(schemas);
