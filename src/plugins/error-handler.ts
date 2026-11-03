import type { FastifyError } from 'fastify';
import fp from 'fastify-plugin';
import { AppError, type ErrorDetail } from '#/shared/errors/app.error';
import {
  errorCodeFor,
  HttpError,
  HttpStatus,
  isErrorStatus,
  isServerErrorStatus,
  NotFoundError,
  reasonPhrase,
} from '#/shared/errors/http.error';
import type { ErrorResponse } from '#/shared/schemas/http.schema';

type ErrorBody = Omit<ErrorResponse, 'requestId'>;
type ValidationIssue = NonNullable<FastifyError['validation']>[number];
type LogLevel = 'error' | 'warn' | 'info';

const VALIDATION_ERROR_CODE = 'VALIDATION_ERROR';
const VALIDATION_ERROR_MESSAGE = 'Request validation failed';
const ROUTE_NOT_FOUND_CODE = 'ROUTE_NOT_FOUND';
// Covers Fastify (FST_ERR_*) and its official plugins (e.g. FST_REQ_*).
const FRAMEWORK_ERROR_CODE_PREFIX = 'FST_';

/** "/user/0/name" + context "body" -> "body.user.0.name" (JSON Pointer to dotted path). */
function validationPath(
  issue: ValidationIssue,
  context: string | undefined,
): string {
  const segments = issue.instancePath
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.replaceAll('~1', '/').replaceAll('~0', '~'));

  // Ajv reports a missing required field on its parent object.
  const { missingProperty } = issue.params;
  if (typeof missingProperty === 'string') {
    segments.push(missingProperty);
  }

  return [context ?? 'request', ...segments].join('.');
}

function toValidationDetails(
  issues: readonly ValidationIssue[],
  context: string | undefined,
): ErrorDetail[] {
  return issues.map((issue) => ({
    path: validationPath(issue, context),
    message: issue.message ?? 'Invalid value',
  }));
}

function withDetails(
  details: readonly ErrorDetail[],
): Pick<ErrorBody, 'details'> {
  return details.length > 0 ? { details: [...details] } : {};
}

/** HTTP status the client will receive for this error. */
function statusCodeOf(error: FastifyError): number {
  if (error instanceof HttpError) return error.statusCode;
  if (error instanceof AppError) return HttpStatus.INTERNAL_SERVER_ERROR;
  if (error.validation) return HttpStatus.BAD_REQUEST;

  const { statusCode } = error;
  return statusCode !== undefined && isErrorStatus(statusCode)
    ? statusCode
    : HttpStatus.INTERNAL_SERVER_ERROR;
}

/** 503 is expected under load (under-pressure), so it is not logged as an error. */
function logLevelOf(statusCode: number): LogLevel {
  if (statusCode === HttpStatus.SERVICE_UNAVAILABLE) return 'warn';
  return isServerErrorStatus(statusCode) ? 'error' : 'info';
}

/** Builds the client-safe body. Nothing internal ever leaves through here. */
function toErrorBody(error: FastifyError, statusCode: number): ErrorBody {
  // 5xx: never expose the original message. The real error is only logged.
  if (isServerErrorStatus(statusCode)) {
    return {
      statusCode,
      code: error instanceof AppError ? error.code : errorCodeFor(statusCode),
      message: reasonPhrase(statusCode),
    };
  }

  // Errors thrown on purpose by the application.
  if (error instanceof AppError) {
    return {
      statusCode,
      code: error.code,
      message: error.message,
      ...withDetails(error.details),
    };
  }

  // Schema validation failures raised by Fastify.
  if (error.validation) {
    return {
      statusCode,
      code: VALIDATION_ERROR_CODE,
      message: VALIDATION_ERROR_MESSAGE,
      details: toValidationDetails(error.validation, error.validationContext),
    };
  }

  // 4xx from Fastify and its official plugins (invalid JSON, body too large,
  // unsupported media type, file too large...) have safe messages and stable
  // codes. Other libraries may throw errors without a `code`.
  if (error.code?.startsWith(FRAMEWORK_ERROR_CODE_PREFIX)) {
    return { statusCode, code: error.code, message: error.message };
  }

  // Any other 4xx from unknown sources: keep the status, hide the message.
  return {
    statusCode,
    code: errorCodeFor(statusCode),
    message: reasonPhrase(statusCode),
  };
}

export default fp(
  async function errorHandlerPlugin(app) {
    app.setErrorHandler((error: FastifyError, request, reply) => {
      const statusCode = statusCodeOf(error);

      request.log[logLevelOf(statusCode)]({ err: error }, 'request failed');

      return reply.status(statusCode).send({
        ...toErrorBody(error, statusCode),
        requestId: request.id,
      } satisfies ErrorResponse);
    });

    app.setNotFoundHandler((request, reply) =>
      reply.send(
        new NotFoundError(`Route ${request.method} ${request.url} not found`, {
          code: ROUTE_NOT_FOUND_CODE,
        }),
      ),
    );
  },
  { name: 'error-handler' },
);
