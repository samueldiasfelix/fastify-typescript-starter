import { describe, expect, it } from 'vitest';
import { User } from '#/modules/users/user.entity';
import { toDto } from '#/modules/users/user.mapper';
import { createUserSchema } from '#/modules/users/user.schema';
import {
  EMAIL_MAX_LENGTH,
  Email,
} from '#/modules/users/value-objects/email';
import { Role } from '#/modules/users/value-objects/role';
import { UserName } from '#/modules/users/value-objects/user-name';

describe('value objects', () => {
  it('Email normaliza e valida', () => {
    expect(Email.create('Foo@Bar.COM').value).toBe('foo@bar.com');
    expect(() => Email.create(' foo@bar.com')).toThrow('E-mail inválido.');
    expect(() => Email.create('invalido')).toThrow('E-mail inválido.');
  });

  it('Email do VO e do schema zod concordam nas bordas', () => {
    const cases = [
      'a@b.com',
      'A@B.COM',
      'a@b',
      'a..b@c.com',
      'a b@c.com',
      ' a@b.com',
      'a@b.c',
      'x@y.museum',
      '.a@b.com',
      `${'a'.repeat(EMAIL_MAX_LENGTH)}@x.com`,
    ];
    for (const email of cases) {
      const fromSchema = createUserSchema.safeParse({ name: 'n', email });
      let fromValueObject = true;
      try {
        Email.create(email);
      } catch {
        fromValueObject = false;
      }
      expect(fromValueObject, email).toBe(fromSchema.success);
    }
  });

  it('Email rejeita acima do limite', () => {
    const local = 'a'.repeat(EMAIL_MAX_LENGTH);
    expect(() => Email.create(`${local}@x.com`)).toThrow('E-mail inválido.');
  });

  it('Role rejeita papel desconhecido', () => {
    expect(Role.create('admin').value).toBe('admin');
    expect(() => Role.create('root')).toThrow('Papel inválido.');
  });

  it('UserName faz trim e rejeita vazio/longo', () => {
    expect(UserName.create('  Ana  ').value).toBe('Ana');
    expect(() => UserName.create('   ')).toThrow();
    expect(() => UserName.create('a'.repeat(121))).toThrow();
  });
});

describe('User entity', () => {
  it('create gera id v7 e role customer', () => {
    const user = User.create({ name: 'Ana', email: 'ana@x.com' });
    expect(user.id.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(user.roles.map((r) => r.value)).toEqual(['customer']);
    expect(user.deletedAt).toBeNull();
  });

  it('rename e changeEmail atualizam updatedAt', async () => {
    const user = User.create({ name: 'Ana', email: 'ana@x.com' });
    const before = user.updatedAt;
    await new Promise((r) => setTimeout(r, 5));
    user.rename('Bia');
    user.changeEmail('BIA@x.com');
    expect(user.name.value).toBe('Bia');
    expect(user.email.value).toBe('bia@x.com');
    expect(user.updatedAt.getTime()).toBeGreaterThan(before.getTime());
  });

  it('toDto não expõe passwordHash nem roles', () => {
    const dto = toDto(User.create({ name: 'Ana', email: 'ana@x.com' }));
    expect(Object.keys(dto).sort()).toEqual(['email', 'id', 'name']);
  });
});
