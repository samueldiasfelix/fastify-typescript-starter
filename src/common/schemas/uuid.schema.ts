import { z } from 'zod';

export const uuidSchema = z.uuid();

export const uuidParamsSchema = z.object({
  id: uuidSchema,
});

export type Uuid = z.infer<typeof uuidSchema>;
export type UuidParams = z.infer<typeof uuidParamsSchema>;
