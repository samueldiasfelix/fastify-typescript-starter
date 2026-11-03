/** A single, client-safe description of what went wrong (e.g. one invalid field). */
export interface ErrorDetail {
  readonly path: string;
  readonly message: string;
}

export interface AppErrorOptions {
  /** Stable, machine-readable identifier (e.g. "USER_NOT_FOUND"). */
  readonly code?: string;
  /** Client-safe details. Never put internal information here. */
  readonly details?: readonly ErrorDetail[];
  /** Original error, kept for logs only and never sent to the client. */
  readonly cause?: unknown;
}

const DEFAULT_ERROR_CODE = 'APP_ERROR';

/**
 * Base class for every error thrown on purpose by the application.
 * It is transport-agnostic: HTTP concerns live in `HttpError`.
 */
export class AppError extends Error {
  readonly code: string;
  readonly details: readonly ErrorDetail[];

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message, { cause: options.cause });

    this.name = new.target.name;
    this.code = options.code ?? DEFAULT_ERROR_CODE;
    this.details = options.details ?? [];
  }
}
