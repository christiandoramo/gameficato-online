// apps/customers/src/infrastructure/nest/controllers/reward/create.controller.ts
import { Controller } from '@nestjs/common';
import { Logger } from 'winston';
import {
  NatsMessagePattern,
  Ctx,
  Payload,
  NatsContext,
} from '@gameficato/common/modules/rpc.module';
import { MicroserviceController } from '@gameficato/common/decorators/microservice_controller.decorator';
import { RepositoryParam } from '@gameficato/common/decorators/repository.decorator';
import { EventEmitterParam } from '@gameficato/common/decorators/event_emitter.decorator';
import {
  NatsMessage,
  NatsResponse,
} from '@gameficato/common/helpers/nats_message.helper';
import { RewardDatabaseRepository } from '@gameficato/customers/infrastructure/sequelize/repositories/reward.repository';
import {
  CreateRewardController as ICreateRewardController,
  CreateRewardRequest,
  CreateRewardResponse,
} from '@gameficato/customers/interface/controllers/reward/create.controller';
import { RewardEventNatsEmitter } from '../../events/reward.emitter';
import { NATS_SERVICES } from '@gameficato/customers/infrastructure/nats/nats.constants';
import { LoggerParam } from '@gameficato/common';
import { UserDatabaseRepository } from '@gameficato/customers/infrastructure/sequelize/repositories/user.repository';

export type CreateRewardNatsRequest = NatsMessage<CreateRewardRequest>;
export type CreateRewardNatsResponse = NatsResponse<CreateRewardResponse>;

@Controller()
@MicroserviceController()
export class CreateRewardMicroserviceController {
  @NatsMessagePattern(NATS_SERVICES.REWARD.CREATE)
  async execute(
    @RepositoryParam(RewardDatabaseRepository) repoRewawrd,
    @RepositoryParam(UserDatabaseRepository) repoUser,
    @EventEmitterParam(RewardEventNatsEmitter) emitter,
    @LoggerParam(CreateRewardMicroserviceController) logger: Logger,
    @Payload() msg: CreateRewardRequest,
    @Ctx() ctx: NatsContext,
  ): Promise<CreateRewardNatsResponse> {
    logger.debug('Received create reward', { msg });
    const controller = new ICreateRewardController(
      logger,
      repoRewawrd,
      repoUser,
      emitter,
    );
    const payload = new CreateRewardRequest(msg);
    logger.info('payload: ', { payload });
    const reward = await controller.execute(payload);

    logger.info('reward created: ', { reward });

    return { value: reward, ctx };
  }
}
