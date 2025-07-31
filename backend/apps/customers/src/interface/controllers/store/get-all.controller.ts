import { Logger } from 'winston';
import { IsString, IsUUID } from 'class-validator';
import { AutoValidator } from '@gameficato/common/utils/validate.util';
import { Store } from '@gameficato/customers/domain/entities/store.entity';
import { GetAllStoreUseCase } from '@gameficato/customers/application/usecases/store/get-all.usecase';
import { filterProperties } from '@gameficato/common/utils/filter_properties.util';
import { StoreRepository } from '@gameficato/customers/domain/repositories/store.repository';
import { IsIsoStringDateFormat } from '@gameficato/common';

type TGetAllStoreResponse = Pick<Store, 'id' | 'name' | 'createdAt'>;

export class GetAllStoreResponse
  extends AutoValidator
  implements TGetAllStoreResponse
{
  constructor(props: TGetAllStoreResponse) {
    super(
      filterProperties(props, {
        id: null,
        name: null,
        createdAt: null,
      } as TGetAllStoreResponse),
    );
  }

  @IsUUID()
  id: Store['id'];

  @IsString()
  name: Store['name'];

  @IsIsoStringDateFormat('YYYY-MM-DDTHH:mm:ss.SSSZ', {
    message: 'Invalid format createdAt',
  })
  createdAt: Store['createdAt'];
}

export class GetAllStoreController {
  private readonly usecase: GetAllStoreUseCase;

  constructor(
    private readonly logger: Logger,
    storeRepository: StoreRepository,
  ) {
    this.logger = logger.child({
      context: GetAllStoreController.name,
    });

    this.usecase = new GetAllStoreUseCase(this.logger, storeRepository);
  }

  async execute(): Promise<GetAllStoreResponse[]> {
    this.logger.info('Get all store request.');

    const result = await this.usecase.execute();

    const response = result.map((store) => new GetAllStoreResponse(store));

    this.logger.info('Get all store response.', {
      result: response,
    });

    return response;
  }
}
