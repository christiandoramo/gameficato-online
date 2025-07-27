import { Logger } from 'winston';
import { Controller } from '@nestjs/common';
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
import { EventEmitterParam } from '@gameficato/common/decorators/event_emitter.decorator';
import { UserRepository } from '@gameficato/customers/domain/repositories/user.repository';
import {
  UpdateUserController,
  UpdateUserRequest,
  UpdateUserResponse,
} from '@gameficato/customers/interface/controllers/user/update.controller';
import { UserEventEmitterControllerInterface } from '@gameficato/customers/interface/events/user.emitter';
import { UserDatabaseRepository } from '@gameficato/customers/infrastructure/sequelize/repositories/user.repository';
import { NATS_SERVICES } from '@gameficato/customers/infrastructure/nats/nats.constants';
import { UserEventNatsEmitter } from '@gameficato/customers/infrastructure/nest/events/user.emitter';

export type UpdateUserNatsRequest = NatsMessage<UpdateUserRequest>;
export type UpdateUserNatsResponse = NatsResponse<UpdateUserResponse>;

/**
 * Update user controller.
 */
@Controller()
@MicroserviceController()
export class UpdateUserMicroserviceController {
  /**
   * Parse update user message and call update user controller.
   *
   * @param userRepository User repository.
   * @param logger Request logger.
   * @param message Request Nats message.
   * @returns Response Nats message.
   */
  @NatsMessagePattern(NATS_SERVICES.USER.UPDATE)
  async execute(
    @RepositoryParam(UserDatabaseRepository)
    userRepository: UserRepository,
    @LoggerParam(UpdateUserMicroserviceController)
    logger: Logger,
    @Payload() message: UpdateUserRequest,
    @EventEmitterParam(UserEventNatsEmitter)
    userEventEmitter: UserEventEmitterControllerInterface,
  ): Promise<UpdateUserNatsResponse> {
    logger.debug('Received message.', { value: message });

    // Parse nats message.
    const payload = new UpdateUserRequest(message);

    logger.info('Updating user.', { payload });

    // Create update user controller.
    const controller = new UpdateUserController(
      logger,
      userRepository,
      userEventEmitter,
    );

    // Update user.
    const updatedUser = await controller.execute(payload);

    logger.info('User updated.', { updatedUser });

    return {
      value: updatedUser,
    };
  }
}
