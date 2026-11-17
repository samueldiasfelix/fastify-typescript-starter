import type { UserRepository } from './repositories/user.repository.js';
import { User } from './user.entity.js';
import { UserNotFoundError } from './user.error.js';
import { toDto } from './user.mapper.js';
import type {
  CreateUserInput,
  ListUsersQuery,
  UpdateUserInput,
  UserDto,
} from './user.schema.js';
import { UserId } from './value-objects/user-id.js';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async list(query: ListUsersQuery): Promise<UserDto[]> {
    return (await this.userRepository.findAll(query)).map(toDto);
  }

  async getById(id: string): Promise<UserDto> {
    return toDto(await this.findOrFail(id));
  }

  async create(input: CreateUserInput): Promise<UserDto> {
    const user = User.create(input);
    return toDto(await this.userRepository.save(user));
  }

  async update(id: string, input: UpdateUserInput): Promise<UserDto> {
    const user = await this.findOrFail(id);
    if (input.name !== undefined) user.rename(input.name);
    if (input.email !== undefined) user.changeEmail(input.email);
    return toDto(await this.userRepository.save(user));
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(UserId.create(id));
    if (!deleted) throw new UserNotFoundError();
  }

  private async findOrFail(id: string): Promise<User> {
    const user = await this.userRepository.findById(UserId.create(id));
    if (!user) throw new UserNotFoundError();
    return user;
  }
}
