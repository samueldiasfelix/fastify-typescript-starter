import { UnprocessableEntityError } from '#/common/errors/handler.error';

export const USER_NAME_MIN_LENGTH = 1;
export const USER_NAME_MAX_LENGTH = 120;
export const USER_NAME_PATTERN = /\S/;

export class UserName {
  private constructor(readonly value: string) {}

  static create(raw: string): UserName {
    const value = raw.trim();
    if (
      value.length < USER_NAME_MIN_LENGTH ||
      value.length > USER_NAME_MAX_LENGTH ||
      !USER_NAME_PATTERN.test(value)
    ) {
      throw new UnprocessableEntityError(
        `Nome inválido: use de ${USER_NAME_MIN_LENGTH} a ${USER_NAME_MAX_LENGTH} caracteres.`,
        { code: 'INVALID_USER_NAME' },
      );
    }
    return new UserName(value);
  }

  equals(other: UserName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
