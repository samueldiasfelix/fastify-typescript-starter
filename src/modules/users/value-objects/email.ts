import { UnprocessableEntityError } from '#/common/errors/handler.error';

export const EMAIL_MAX_LENGTH = 254;
export const EMAIL_PATTERN =
  /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

export class Email {
  private constructor(readonly value: string) {}

  static create(raw: string): Email {
    const value = raw.toLowerCase();
    if (value.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(value)) {
      throw new UnprocessableEntityError('E-mail inválido.', {
        code: 'INVALID_EMAIL',
      });
    }
    return new Email(value);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
