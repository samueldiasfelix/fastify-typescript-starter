import { z } from 'zod';
import { EMAIL_MAX_LENGTH, EMAIL_PATTERN } from './value-objects/email.js';
import {
  USER_NAME_MAX_LENGTH,
  USER_NAME_MIN_LENGTH,
  USER_NAME_PATTERN,
} from './value-objects/user-name.js';

const Name = z
  .string()
  .min(USER_NAME_MIN_LENGTH)
  .max(USER_NAME_MAX_LENGTH)
  .regex(USER_NAME_PATTERN);

const Email = z.email({ pattern: EMAIL_PATTERN }).max(EMAIL_MAX_LENGTH);

const Id = z.uuid();

export const userSchema = z
  .object({
    id: Id,
    name: Name,
    email: Email,
  })
  .strict();

export const createUserSchema = z
  .object({
    name: Name,
    email: Email,
  })
  .strict();

export const updateUserSchema = createUserSchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one property must be provided',
  });

export const userParamsSchema = z.object({
  id: Id,
});

export const listUsersQuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict();

export const userListSchema = z.array(userSchema);

export type UserDto = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserParams = z.infer<typeof userParamsSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
