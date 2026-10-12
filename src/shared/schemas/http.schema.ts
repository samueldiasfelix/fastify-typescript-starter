import Type from 'typebox';

export const ErrorDetailSchema = Type.Object({
  path: Type.String({
    description: 'Where the problem is, e.g. "body.email"',
  }),
  message: Type.String(),
});

export const ErrorResponseSchema = Type.Object({
  statusCode: Type.Integer({ minimum: 400, maximum: 599 }),
  code: Type.String({
    description: 'Stable, machine-readable error code, e.g. "NOT_FOUND"',
  }),
  message: Type.String(),
  details: Type.Optional(Type.Array(ErrorDetailSchema)),
  requestId: Type.String(),
});

export type ErrorResponse = Type.Static<typeof ErrorResponseSchema>;

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
};
