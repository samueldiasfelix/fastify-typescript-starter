import { Email } from './value-objects/email.js';
import { Role } from './value-objects/role.js';
import { UserId } from './value-objects/user-id.js';
import { UserName } from './value-objects/user-name.js';

export interface UserProps {
  id: UserId;
  name: UserName;
  email: Email;
  roles: Role[];
  emailVerified: boolean;
  passwordHash: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class User {
  private constructor(private props: UserProps) {}

  /** Novo usuário: gera id e datas. */
  static create(input: { name: string; email: string }): User {
    const now = new Date();
    return new User({
      id: UserId.generate(),
      name: UserName.create(input.name),
      email: Email.create(input.email),
      roles: [Role.CUSTOMER],
      emailVerified: false,
      passwordHash: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  /** Reidrata do banco, sem gerar nada. */
  static restore(props: UserProps): User {
    return new User({ ...props, roles: [...props.roles] });
  }

  get id(): UserId {
    return this.props.id;
  }

  get name(): UserName {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get roles(): readonly Role[] {
    return this.props.roles;
  }

  get emailVerified(): boolean {
    return this.props.emailVerified;
  }

  get passwordHash(): string | null {
    return this.props.passwordHash;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }

  rename(name: string): void {
    this.props.name = UserName.create(name);
    this.touch();
  }

  changeEmail(email: string): void {
    const next = Email.create(email);
    if (next.equals(this.props.email)) return;
    this.props.email = next;
    this.props.emailVerified = false;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
