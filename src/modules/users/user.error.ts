import {
  ConflictError,
  NotFoundError,
} from '../../common/errors/handler.error.js';

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('Usuário não encontrado.', { code: 'USER_NOT_FOUND' });
  }
}

export class UserEmailAlreadyExistsError extends ConflictError {
  constructor() {
    super('Já existe um usuário com esse e-mail.', {
      code: 'USER_EMAIL_ALREADY_EXISTS',
    });
  }
}
