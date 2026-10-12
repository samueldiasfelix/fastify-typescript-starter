export class UserNotFoundError extends Error {
  readonly statusCode = 404;
  readonly code = 'USER_NOT_FOUND';

  constructor() {
    super('Usuário não encontrado.');
    this.name = 'UserNotFoundError';
  }
}

export class UserEmailAlreadyExistsError extends Error {
  readonly statusCode = 409;
  readonly code = 'USER_EMAIL_ALREADY_EXISTS';

  constructor() {
    super('Já existe um usuário com esse e-mail.');
    this.name = 'UserEmailAlreadyExistsError';
  }
}
