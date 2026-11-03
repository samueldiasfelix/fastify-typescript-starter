import Type, { type Static } from 'typebox';

export const uuidSchema = Type.String({
  format: 'uuid',
});

export const uuidParamsSchema = Type.Object({
  id: uuidSchema,
});

export type Uuid = Static<typeof uuidSchema>;
export type UuidParams = Static<typeof uuidParamsSchema>;
