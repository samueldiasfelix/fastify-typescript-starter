import { NotFoundError } from '../../common/errors/handler.error.js';

export class CustomerNotFoundError extends NotFoundError {
  constructor() {
    super('Cliente não encontrado.', { code: 'CUSTOMER_NOT_FOUND' });
  }
}
