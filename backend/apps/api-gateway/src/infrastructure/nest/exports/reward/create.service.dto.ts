// apps/api-gateway/src/infrastructure/nest/exports/reward/create.service.ts

import { Logger } from 'winston';
import {
  NatsService,
  NatsAddService,
} from '@gameficato/common/modules/rpc.module';
import { CreateRewardNatsRequest } from '@gameficato/customers/infrastructure/nest/controllers/reward/create.controller';
import { NATS_SERVICES } from '@gameficato/customers/infrastructure/nats/nats.constants';
import {
  CreateRewardRequest,
  CreateRewardResponse,
} from '@gameficato/customers/interface/controllers/reward/create.controller';

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
    const data: CreateRewardNatsRequest = {
      key: payload.userId,
      headers: { requestId: this.requestId },
      value: payload,
    };

    this.logger
      .child({ loggerId: this.requestId })
      .debug('Send create reward message.', { data });

    // envia e aguarda a resposta do microservice de customers
    const response = await this.natsService.send<
      CreateRewardResponse,
      CreateRewardNatsRequest
    >(NATS_SERVICES.REWARD.CREATE, data);

    this.logger.debug('Received create reward response.', { response });
    return response;
  }
}
