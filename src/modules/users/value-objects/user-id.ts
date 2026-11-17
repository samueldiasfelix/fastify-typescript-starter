import { randomUUIDv7 } from 'node:crypto';
import { UnprocessableEntityError } from '#/common/errors/handler.error';

export const USER_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class UserId {
  private constructor(readonly value: string) {}

  static generate(): UserId {
    return new UserId(randomUUIDv7());
  }

  static create(raw: string): UserId {
    if (!USER_ID_PATTERN.test(raw)) {
      throw new UnprocessableEntityError('ID de usuário inválido.', {
        code: 'INVALID_USER_ID',
      });
    }
    return new UserId(raw);
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
