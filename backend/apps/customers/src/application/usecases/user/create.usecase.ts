// apps/customers/src/application/usecases/user/create.usecase.ts
import type { Logger } from 'winston';
import { MissingDataException } from '@gameficato/common/exceptions/missing_data.exception';
import type { User } from '@gameficato/customers/domain/entities/user.entity';
import type {
  CreateUserData,
  UserRepository,
} from '@gameficato/customers/domain/repositories/user.repository';
import { UserAlreadyExistsException } from '@gameficato/customers/application/exceptions/user_already_exists.exception';
import type { UserEventEmitter } from '@gameficato/customers/application/events/user.emitter';

export class CreateUserUseCase {
  /**
   * Default constructor.
   * @param logger Global logger instance.
   * @param userRepository User repository.
   * @param hashProvider Hash provider.
   * @param userEventEmitter User event emitter.
   */
  constructor(
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly userEventEmitter: UserEventEmitter,
  ) {
    this.logger = logger.child({ context: CreateUserUseCase.name });
  }

  /**
   * Create user.
   *
   * @param id User uuid.
   * @param name User name.
   * @param password User password.
   * @param email User email.
   * @returns The created user.
   * @throws {MissingDataException} Thrown when any required params are missing.
   * @throws {UserAlreadyExistsException} Thrown when user already exists.
   */
  async execute(user: CreateUserData): Promise<User> {
    const { id, name, password, email, storeId } = user;

    // Data input check
    if (!id || !name || !password || !email || !storeId) {
      throw new MissingDataException([
        ...(!id ? ['Id'] : []),
        ...(!name ? ['Name'] : []),
        ...(!password ? ['Password'] : []),
        ...(!email ? ['Email'] : []),
      ]);
    }

    const existingUser = await this.userRepository.getByEmail(email);
    this.logger.debug('Found User by email.', { user: existingUser });

    // already exist user with same email
    if (existingUser) {
      throw new UserAlreadyExistsException(existingUser);
    }

    const newUser = await this.userRepository.create(user);

    this.logger.debug('User created.', { user: newUser });

    // Fire created user
    this.userEventEmitter.createdUser(newUser);

    return newUser;
  }
}
