import { type Static, Type } from 'typebox';

const Name = Type.String({
  minLength: 1,
  maxLength: 120,
  pattern: '\\S',
});

const Email = Type.String({
  format: 'email',
  maxLength: 254,
});

export const userSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
    }),
    name: Name,
    email: Email,
  },
  { additionalProperties: false },
);

export const createUserSchema = Type.Object(
  {
    name: Name,
    email: Email,
  },
  { additionalProperties: false },
);

export const updateUserSchema = Type.Partial(createUserSchema, {
  minProperties: 1,
});

export const userParamsSchema = Type.Object({
  id: Type.String({
    format: 'uuid',
  }),
});

export const listUsersQuerySchema = Type.Object(
  {
    limit: Type.Integer({
      minimum: 1,
      maximum: 100,
      default: 20,
    }),
    offset: Type.Integer({
      minimum: 0,
      default: 0,
    }),
  },
  { additionalProperties: false },
);

export const userListSchema = Type.Array(userSchema);

export type User = Static<typeof userSchema>;
export type CreateUserInput = Static<typeof createUserSchema>;
export type UpdateUserInput = Static<typeof updateUserSchema>;
export type UserParams = Static<typeof userParamsSchema>;
export type ListUsersQuery = Static<typeof listUsersQuerySchema>;
