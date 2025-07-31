import { Logger } from 'winston';
import {
  NatsService,
  NatsAddService,
} from '@gameficato/common/modules/rpc.module';
import { NATS_SERVICES } from '@gameficato/customers/infrastructure/nats/nats.constants';
import { GetAllStoreNatsRequest } from '@gameficato/customers/infrastructure/nest/controllers/store/get-all.controller';
import { GetAllStoreResponse } from '@gameficato/customers/interface/controllers/store/get-all.controller';

const SERVICE = NATS_SERVICES.STORE.GET_ALL;

/**
 * Service to call get all stores at stores microservice.
 */
@NatsAddService(SERVICE)
export class GetAllStoreServiceNats {
  /**
   * Default constructor.
   * @param requestId Unique shared request ID.
   * @param logger Global logger.
   * @param natsService Service to access Nats.
   */
  constructor(
    private readonly requestId: string,
    private readonly logger: Logger,
    private readonly natsService: NatsService,
  ) {
    this.logger = logger.child({
      context: GetAllStoreServiceNats.name,
    });
  }

  /**
   * Call store microservice.
   * @returns Paginated stores if found.
   */
  async execute(): Promise<GetAllStoreResponse[]> {
    const logger = this.logger.child({ loggerId: this.requestId });

    const data: GetAllStoreNatsRequest = {
      key: this.requestId,
      headers: { requestId: this.requestId },
      value: null,
    };

    logger.debug('Get all store message.', { data });

    // Call store microservice.
    const result = await this.natsService.send<
      GetAllStoreResponse[],
      GetAllStoreNatsRequest
    >(SERVICE, data);

    logger.debug('Get all store result.', {
      result,
    });

    return result;
  }
}
