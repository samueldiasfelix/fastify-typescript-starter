import { type Static, Type } from 'typebox';

const Id = Type.String({ format: 'uuid' });

export const customerSchema = Type.Object(
  { id: Id, userId: Id },
  { additionalProperties: false },
);

export const createCustomerSchema = Type.Object(
  { userId: Id },
  { additionalProperties: false },
);

export const updateCustomerSchema = Type.Partial(createCustomerSchema, {
  minProperties: 1,
});

export const customerParamsSchema = Type.Object({ id: Id });

export const listCustomersQuerySchema = Type.Object(
  {
    limit: Type.Integer({ minimum: 1, maximum: 100, default: 20 }),
    offset: Type.Integer({ minimum: 0, default: 0 }),
  },
  { additionalProperties: false },
);

export const customerListSchema = Type.Array(customerSchema);

export type Customer = Static<typeof customerSchema>;
export type CreateCustomerInput = Static<typeof createCustomerSchema>;
export type UpdateCustomerInput = Static<typeof updateCustomerSchema>;
export type CustomerParams = Static<typeof customerParamsSchema>;
export type ListCustomersQuery = Static<typeof listCustomersQuerySchema>;
