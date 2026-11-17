import { UnprocessableEntityError } from '#/common/errors/handler.error';

export type RoleValue = 'customer' | 'staff' | 'admin';

export const ROLES: readonly RoleValue[] = ['customer', 'staff', 'admin'];

export class Role {
  static readonly CUSTOMER = new Role('customer');

  private constructor(readonly value: RoleValue) {}

  static create(raw: string): Role {
    const value = ROLES.find((role) => role === raw);
    if (value === undefined) {
      throw new UnprocessableEntityError('Papel inválido.', {
        code: 'INVALID_ROLE',
      });
    }
    return new Role(value);
  }

  equals(other: Role): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
