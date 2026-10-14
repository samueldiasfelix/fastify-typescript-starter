import { NotFoundError } from '#/shared/errors/http.error';

export class CustomerNotFoundError extends NotFoundError {
  constructor() {
    super('Cliente não encontrado.', { code: 'CUSTOMER_NOT_FOUND' });
  }
}
