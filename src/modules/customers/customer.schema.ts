import { z } from 'zod';

const Id = z.uuid();

export const customerSchema = z
  .object({
    id: Id,
    userId: Id,
  })
  .strict();

export const createCustomerSchema = z
  .object({
    userId: Id,
  })
  .strict();

export const updateCustomerSchema = createCustomerSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one property must be provided',
  });

export const customerParamsSchema = z.object({
  id: Id,
});

export const listCustomersQuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict();

export const customerListSchema = z.array(customerSchema);

export type Customer = z.infer<typeof customerSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CustomerParams = z.infer<typeof customerParamsSchema>;
export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>;
