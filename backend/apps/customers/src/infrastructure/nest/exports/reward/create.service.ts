// apps/api-gateway/src/infrastructure/nest/exports/reward/create.service.ts
import { Logger } from 'winston';
import {
  NatsService,
  NatsAddService,
} from '@gameficato/common/modules/rpc.module';
import { CreateRewardNatsRequest } from '../../controllers/reward/create.controller';
import { NATS_SERVICES } from '@gameficato/customers/infrastructure/nats/nats.constants';
import {
  CreateRewardRequest,
  CreateRewardResponse,
} from '@gameficato/customers/interface/controllers/reward/create.controller';

/**
 * Service to call create reward at rewards microservice.
 */
@NatsAddService(NATS_SERVICES.REWARD.CREATE)
export class CreateRewardServiceNats {
  constructor(
    private readonly requestId: string,
    private readonly logger: Logger,
    private readonly natsService: NatsService,
  ) {
    this.logger = logger.child({ context: CreateRewardServiceNats.name });
  }

  async execute(payload: CreateRewardRequest): Promise<CreateRewardResponse> {
    const logger = this.logger.child({ loggerId: this.requestId });

    const data: CreateRewardNatsRequest = {
      key: payload.userId,
      headers: { requestId: this.requestId },
      value: payload,
    };
    console.log('envia aqui viA nats');
    logger.debug('Send create reward message.', { data });

    const result = await this.natsService.send<
      CreateRewardResponse,
      CreateRewardNatsRequest
    >(NATS_SERVICES.REWARD.CREATE, data);

    logger.debug('Received create reward response.', { result });

    return result;
  }
}
