import { Controller } from '@nestjs/common';
import { Logger } from 'winston';
import {
  NatsMessage,
  NatsResponse,
} from '@gameficato/common/helpers/nats_message.helper';
import {
  NatsMessagePattern,
  Payload,
} from '@gameficato/common/modules/rpc.module';
import { LoggerParam } from '@gameficato/common/decorators/logger.decorator';
import { MicroserviceController } from '@gameficato/common/decorators/microservice_controller.decorator';
import { RepositoryParam } from '@gameficato/common/decorators/repository.decorator';
import { UserRepository } from '@gameficato/customers/domain/repositories/user.repository';
import {
  ChangeUserPasswordController,
  ChangeUserPasswordRequest,
  ChangeUserPasswordResponse,
} from '@gameficato/customers/interface/controllers/user/change_password.controller';
import { NATS_SERVICES } from '@gameficato/customers/infrastructure/nats/nats.constants';
import { UserDatabaseRepository } from '@gameficato/customers/infrastructure/sequelize/repositories/user.repository';

export type ChangeUserPasswordNatsRequest =
  NatsMessage<ChangeUserPasswordRequest>;
export type ChangeUserPasswordNatsResponse =
  NatsResponse<ChangeUserPasswordResponse>;

/**
 * User RPC controller.
 */
@Controller()
@MicroserviceController()
export class ChangeUserPasswordMicroserviceController {
  /**
   * Consumer of change user password.
   *
   * @param userRepository User repository.
   * @param message Request Nats message.
   * @param logger Request logger.
   * @returns Response Nats message.
   */
  @NatsMessagePattern(NATS_SERVICES.USER.CHANGE_PASSWORD)
  async execute(
    @RepositoryParam(UserDatabaseRepository)
    userRepository: UserRepository,
    @LoggerParam(ChangeUserPasswordMicroserviceController)
    logger: Logger,
    @Payload() message: ChangeUserPasswordRequest,
  ): Promise<ChangeUserPasswordNatsResponse> {
    logger.debug('Received message.', { value: message });

    // Load and validate message payload.
    const payload = new ChangeUserPasswordRequest(message);

    // Create and call change user password controller.
    const controller = new ChangeUserPasswordController(logger, userRepository);

    // User updated.
    const userUpdated = await controller.execute(payload);

    logger.info('User updated.', { userUpdated });

    return {
      value: userUpdated,
    };
  }
}
