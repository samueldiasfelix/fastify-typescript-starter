import { UserNotFoundError } from './user.error.js';
import type { UserRepository } from './user.repository.js';
import type {
  CreateUserInput,
  ListUsersQuery,
  UpdateUserInput,
  User,
} from './user.schema.js';

type Dependencies = { userRepository: UserRepository };

export class UserService {
  private readonly userRepository: UserRepository;

  constructor({ userRepository }: Dependencies) {
    this.userRepository = userRepository;
  }

  list(query: ListUsersQuery): Promise<User[]> {
    return this.userRepository.findAll(query);
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError();
    return user;
  }

  create(input: CreateUserInput): Promise<User> {
    return this.userRepository.create({
      name: input.name.trim(),
      email: input.email.toLowerCase(),
    });
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const changes: UpdateUserInput = {};
    if (input.name !== undefined) changes.name = input.name.trim();
    if (input.email !== undefined) changes.email = input.email.toLowerCase();

    const user = await this.userRepository.update(id, changes);
    if (!user) throw new UserNotFoundError();
    return user;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) throw new UserNotFoundError();
  }
}
