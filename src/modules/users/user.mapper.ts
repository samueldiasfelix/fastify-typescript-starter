import type { NewUserRow, UserRow } from '#/database/schemas/users';
import { User } from './user.entity.js';
import type { UserDto } from './user.schema.js';
import { Email } from './value-objects/email.js';
import { Role } from './value-objects/role.js';
import { UserId } from './value-objects/user-id.js';
import { UserName } from './value-objects/user-name.js';

export function toEntity(row: UserRow): User {
  return User.restore({
    id: UserId.create(row.id),
    name: UserName.create(row.name),
    email: Email.create(row.email),
    roles: row.roles.map((role) => Role.create(role)),
    emailVerified: row.emailVerified,
    passwordHash: row.passwordHash,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  });
}

export function toPersistence(user: User): NewUserRow {
  return {
    id: user.id.value,
    name: user.name.value,
    email: user.email.value,
    roles: user.roles.map((role) => role.value),
    emailVerified: user.emailVerified,
    passwordHash: user.passwordHash,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
  };
}

export function toDto(user: User): UserDto {
  return {
    id: user.id.value,
    name: user.name.value,
    email: user.email.value,
  };
}
