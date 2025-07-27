import type { Logger } from 'winston';
import { MissingDataException } from '@gameficato/common/exceptions/missing_data.exception';
import type { User } from '@gameficato/customers/domain/entities/user.entity';
import type {
  UpdateUserData,
  UserRepository,
} from '@gameficato/customers/domain/repositories/user.repository';
import type { UserEventEmitter } from '@gameficato/customers/application/events/user.emitter';
import { UserNotFoundException } from '@gameficato/customers/application/exceptions/user_not_found.exception';
import { filterProperties } from '@gameficato/common/utils/filter_properties.util';

export class UpdateUserUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: UserEventEmitter,
  ) {
    this.logger = logger.child({ context: UpdateUserUseCase.name });
  }

  /**
   * Update user properties.
   * @param updateData Object containing user uuid and properties to update.
   * @throws {MissingDataException} When uuid is missing.
   * @throws {UserNotFoundException} When user is not found.
   */
  async execute(updateData: UpdateUserData): Promise<User> {
    if (!updateData?.id) {
      throw new MissingDataException('User Uuid');
    }

    const { id } = updateData;

    const user = await this.userRepository.getById(id);

    this.logger.debug('User found.', { user });

    if (!user) {
      throw new UserNotFoundException({ id });
    }

    const updatedUser = await this.userRepository.update({
      ...user,
      ...filterProperties(updateData, {
        id: null,
        name: null,
        email: null,
        updatedAt: null,
      } as UpdateUserData),
    });

    this.logger.debug('User updated.', { updatedUser });

    this.eventEmitter.updatedUser(updatedUser);

    return updatedUser;
  }
}
