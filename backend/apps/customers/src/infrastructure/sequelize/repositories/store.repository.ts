// apps/customers/src/infrastructure/sequelize/repositories/store.repository.ts
import { DatabaseRepository } from '@gameficato/common/modules/sequelize.module';
import type { Store } from '@gameficato/customers/domain/entities/store.entity';
import type { StoreRepository } from '@gameficato/customers/domain/repositories/store.repository';
import { StoreModel } from '../models/store_stub.model';

export class StoreDatabaseRepository
  extends DatabaseRepository
  implements StoreRepository
{
  static toDomain(model: StoreModel | null): Store | null {
    return model?.toDomain() ?? null;
  }

  async getAll(): Promise<Store[]> {
    const stores = await StoreModel.findAll();

    return stores.map(StoreDatabaseRepository.toDomain);
  }
}
