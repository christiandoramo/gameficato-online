import { Controller } from '@nestjs/common';
import { Logger } from 'winston';
import { EventEmitterParam } from '@gameficato/common/decorators/event_emitter.decorator';
import {
  NatsMessage,
  NatsResponse,
} from '@gameficato/common/helpers/nats_message.helper';
import {
  Ctx,
  NatsContext,
  NatsMessagePattern,
  Payload,
} from '@gameficato/common/modules/rpc.module';
import { LoggerParam } from '@gameficato/common/decorators/logger.decorator';
import { MicroserviceController } from '@gameficato/common/decorators/microservice_controller.decorator';
import { RepositoryParam } from '@gameficato/common/decorators/repository.decorator';
import { UserRepository } from '@gameficato/customers/domain/repositories/user.repository';
import {
  CreateUserController,
  CreateUserRequest,
  CreateUserResponse,
} from '@gameficato/customers/interface/controllers/user/create.controller';
import { UserEventEmitterControllerInterface } from '@gameficato/customers/interface/events/user.emitter';
import { NATS_SERVICES } from '@gameficato/customers/infrastructure/nats/nats.constants';
import { UserDatabaseRepository } from '@gameficato/customers/infrastructure/sequelize/repositories/user.repository';
import { UserEventNatsEmitter } from '@gameficato/customers/infrastructure/nest/events/user.emitter';

export type CreateUserNatsRequest = NatsMessage<CreateUserRequest>;
export type CreateUserNatsResponse = NatsResponse<CreateUserResponse>;

/**
 * User RPC controller.
 */
@Controller()
@MicroserviceController()
export class CreateUserMicroserviceController {
  /**
   * Consumer of create user by signup.
   *
   * @param userRepository User repository.
   * @param logger Request logger.
   * @param userEventEmitter User event emitter.
   * @param message Request Nats message.
   * @returns Response Nats message.
   */
  @NatsMessagePattern(NATS_SERVICES.USER.CREATE)
  async execute(
    @RepositoryParam(UserDatabaseRepository)
    userRepository: UserRepository,
    @LoggerParam(CreateUserMicroserviceController)
    logger: Logger,
    @EventEmitterParam(UserEventNatsEmitter)
    userEventEmitter: UserEventEmitterControllerInterface,
    @Payload() message: CreateUserRequest,
    @Ctx() ctx: NatsContext,
  ): Promise<CreateUserNatsResponse> {
    logger.debug('Received message.', { value: message });

    // Load and validate message payload.
    const payload = new CreateUserRequest(message);

    logger.info('Create user by signup.', { payload });

    // Create and call create user by signup controller.
    const controller = new CreateUserController(
      logger,
      userRepository,
      userEventEmitter,
    );

    // Create user
    const user = await controller.execute(payload);

    logger.info('User created.', { user });

    return {
      value: user,
      ctx,
    };
  }
}
