import { Controller } from '@nestjs/common';
import { Logger } from 'winston';
import {
  NatsMessage,
  NatsResponse,
} from '@gameficato/common/helpers/nats_message.helper';
import {
  Ctx,
  NatsContext,
  NatsMessagePattern,
} from '@gameficato/common/modules/rpc.module';
import { LoggerParam } from '@gameficato/common/decorators/logger.decorator';
import { MicroserviceController } from '@gameficato/common/decorators/microservice_controller.decorator';
import { RepositoryParam } from '@gameficato/common/decorators/repository.decorator';
import { UserDatabaseRepository } from '@gameficato/customers/infrastructure/sequelize/repositories/user.repository';
import { NATS_SERVICES } from '@gameficato/customers/infrastructure/nats/nats.constants';
import {
  GetAllUserController,
  GetAllUserResponse,
} from '@gameficato/customers/interface/controllers/user/get_all.controller';
import { UserRepository } from '@gameficato/customers/domain/repositories/user.repository';

export type GetAllUserNatsRequest = NatsMessage<void>;
export type GetAllUserNatsResponse = NatsResponse<GetAllUserResponse[]>;

/**
 * User RPC controller.
 */
@Controller()
@MicroserviceController()
export class GetAllUserMicroserviceController {
  /**
   * Consumer of get all user.
   *
   * @param userRepository User repository.
   * @param logger Request logger.
   * @param message Request Nats message.
   * @returns Response Nats message.
   */
  @NatsMessagePattern(NATS_SERVICES.USER.GET_ALL)
  async execute(
    @RepositoryParam(UserDatabaseRepository)
    userRepository: UserRepository,
    @LoggerParam(GetAllUserMicroserviceController)
    logger: Logger,
    @Ctx() ctx: NatsContext,
  ): Promise<GetAllUserNatsResponse> {
    logger.debug('Received message.');

    // Create and call user controller.
    const controller = new GetAllUserController(logger, userRepository);

    // Call user controller
    const user = await controller.execute();

    logger.info('User found.', { user });

    return {
      value: user,
      ctx,
    };
  }
}
