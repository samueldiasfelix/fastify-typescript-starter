import { z } from 'zod';

export const ErrorDetailSchema = z.object({
  path: z.string().describe('Where the problem is, e.g. "body.email"'),
  message: z.string(),
});

export const ErrorResponseSchema = z.object({
  statusCode: z.int().min(400).max(599),
  code: z
    .string()
    .describe('Stable, machine-readable error code, e.g. "NOT_FOUND"'),
  message: z.string(),
  details: z.array(ErrorDetailSchema).optional(),
  requestId: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

/** Spread into a route's `response` to document the common error responses. */
export const HttpErrorResponses = {
  400: ErrorResponseSchema,
  401: ErrorResponseSchema,
  403: ErrorResponseSchema,
  404: ErrorResponseSchema,
  409: ErrorResponseSchema,
  422: ErrorResponseSchema,
  429: ErrorResponseSchema,
  500: ErrorResponseSchema,
  503: ErrorResponseSchema,
};
