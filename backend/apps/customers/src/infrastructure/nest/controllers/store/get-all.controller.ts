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
import { StoreDatabaseRepository } from '@gameficato/customers/infrastructure/sequelize/repositories/store.repository';
import { NATS_SERVICES } from '@gameficato/customers/infrastructure/nats/nats.constants';
import { StoreRepository } from '@gameficato/customers/domain/repositories/store.repository';

import {
  GetAllStoreController,
  GetAllStoreResponse,
} from '@gameficato/customers/interface/controllers/store/get-all.controller';

export type GetAllStoreNatsRequest = NatsMessage<void>;
export type GetAllStoreNatsResponse = NatsResponse<GetAllStoreResponse[]>;

/**
 * Store RPC controller.
 */
@Controller()
@MicroserviceController()
export class GetAllStoreMicroserviceController {
  /**
   * Consumer of get all store.
   *
   * @param storeRepository Store repository.
   * @param logger Request logger.
   * @param message Request Nats message.
   * @returns Response Nats message.
   */
  @NatsMessagePattern(NATS_SERVICES.STORE.GET_ALL)
  async execute(
    @RepositoryParam(StoreDatabaseRepository)
    storeRepository: StoreRepository,
    @LoggerParam(GetAllStoreMicroserviceController)
    logger: Logger,
    @Ctx() ctx: NatsContext,
  ): Promise<GetAllStoreNatsResponse> {
    logger.debug('Received message.');

    // Create and call store controller.
    const controller = new GetAllStoreController(logger, storeRepository);

    // Call store controller
    const store = await controller.execute();

    logger.info('Store found.', { store });

    return {
      value: store,
      ctx,
    };
  }
}
