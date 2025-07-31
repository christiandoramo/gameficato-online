import type { Logger } from 'winston';
import type { StoreRepository } from '@gameficato/customers/domain/repositories/store.repository';
import type { Store } from '@gameficato/customers/domain/entities/store.entity';

export class GetAllStoreUseCase {
  /**
   * Default constructor.
   * @param logger Global logger instance.
   * @param storeRepository Store repository.
   */
  constructor(
    private readonly logger: Logger,
    private readonly storeRepository: StoreRepository,
  ) {
    this.logger = logger.child({ context: GetAllStoreUseCase.name });
  }

  /**
   * Get all store.
   * @returns Store entity array.
   */
  async execute(): Promise<Store[]> {
    this.logger.debug('Search all stores.');

    const result = await this.storeRepository.getAll();

    this.logger.debug('Stores found.', { result });

    return result;
  }
}
