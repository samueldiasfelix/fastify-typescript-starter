import { STATUS_CODES } from 'node:http';
import { AppError, type AppErrorOptions } from '#/shared/errors/app.error';

interface HttpStatusMap {
  readonly BAD_REQUEST: 400;
  readonly UNAUTHORIZED: 401;
  readonly FORBIDDEN: 403;
  readonly NOT_FOUND: 404;
  readonly CONFLICT: 409;
  readonly UNPROCESSABLE_ENTITY: 422;
  readonly TOO_MANY_REQUESTS: 429;
  readonly INTERNAL_SERVER_ERROR: 500;
  readonly SERVICE_UNAVAILABLE: 503;
}

export const HttpStatus: HttpStatusMap = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export type HttpStatusCode = HttpStatusMap[keyof HttpStatusMap];

const FIRST_CLIENT_ERROR_STATUS = 400;
const FIRST_SERVER_ERROR_STATUS = 500;
const LAST_SERVER_ERROR_STATUS = 599;

export function isErrorStatus(statusCode: number): boolean {
  return (
    statusCode >= FIRST_CLIENT_ERROR_STATUS &&
    statusCode <= LAST_SERVER_ERROR_STATUS
  );
}

export function isServerErrorStatus(statusCode: number): boolean {
  return statusCode >= FIRST_SERVER_ERROR_STATUS;
}

/** Standard reason phrase for a status code, e.g. 404 -> "Not Found". */
export function reasonPhrase(statusCode: number): string {
  return STATUS_CODES[statusCode] ?? 'Unknown Error';
}

/** Default error code for a status code, e.g. 404 -> "NOT_FOUND". */
export function errorCodeFor(statusCode: number): string {
  return reasonPhrase(statusCode).toUpperCase().replaceAll(/\W+/g, '_');
}

export class HttpError extends AppError {
  constructor(
    readonly statusCode: HttpStatusCode,
    message = reasonPhrase(statusCode),
    options: AppErrorOptions = {},
  ) {
    super(message, { code: errorCodeFor(statusCode), ...options });
  }

  get isClientError(): boolean {
    return !this.isServerError;
  }

  get isServerError(): boolean {
    return isServerErrorStatus(this.statusCode);
  }
}

export class BadRequestError extends HttpError {
  constructor(message?: string, options?: AppErrorOptions) {
    super(HttpStatus.BAD_REQUEST, message, options);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message?: string, options?: AppErrorOptions) {
    super(HttpStatus.UNAUTHORIZED, message, options);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message?: string, options?: AppErrorOptions) {
    super(HttpStatus.FORBIDDEN, message, options);
  }
}

export class NotFoundError extends HttpError {
  constructor(message?: string, options?: AppErrorOptions) {
    super(HttpStatus.NOT_FOUND, message, options);
  }
}

export class ConflictError extends HttpError {
  constructor(message?: string, options?: AppErrorOptions) {
    super(HttpStatus.CONFLICT, message, options);
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message?: string, options?: AppErrorOptions) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, message, options);
  }
}

export class TooManyRequestsError extends HttpError {
  constructor(message?: string, options?: AppErrorOptions) {
    super(HttpStatus.TOO_MANY_REQUESTS, message, options);
  }
}

export class InternalServerError extends HttpError {
  constructor(message?: string, options?: AppErrorOptions) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message, options);
  }
}

export class ServiceUnavailableError extends HttpError {
  constructor(message?: string, options?: AppErrorOptions) {
    super(HttpStatus.SERVICE_UNAVAILABLE, message, options);
  }
}
