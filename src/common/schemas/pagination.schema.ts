import Type, { type Static } from 'typebox';

export const paginationQuerySchema = Type.Object({
  page: Type.Optional(
    Type.Integer({
      minimum: 1,
      default: 1,
    }),
  ),
  limit: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 100,
      default: 10,
    }),
  ),
});

export type PaginationQuery = Static<typeof paginationQuerySchema>;
