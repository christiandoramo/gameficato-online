// apps/customers/src/domain/repositories/store.repository.ts
import type { Store } from '@gameficato/customers/domain/entities/store.entity';

export type CreateStoreData = Omit<Store, 'createdAt'>;
export type UpdateStoreData = Partial<Omit<Store, 'id' | 'createdAt'>> &
  Pick<Store, 'id'>;

export interface StoreRepository {
  // /**
  //  * Creates a new store.
  //  * @param store The store object to be created, omitting the 'id' field.
  //  * @returns A promise that resolves to the created Store object.
  //  */
  // create(store: CreateStoreData): Promise<Store>;

  // /**
  //  * Updates an existing store.
  //  * @param store The store object with updated information, including at least the 'id' field.
  //  * @returns A promise that resolves to the updated Store object.
  //  */
  // update(store: UpdateStoreData): Promise<Store>;

  // /**
  //  * Retrieves a store by their ID.
  //  * @param id The numeric ID of the store to find.
  //  * @returns A promise that resolves to the Store object if found, or null otherwise.
  //  */
  // getById(id: Store['id']): Promise<Store | null>;

  // /**
  //  * Retrieves all stores.
  //  * @returns A promise that resolves to array of Store objects.
  //  */
  getAll(): Promise<Store[]>;
}
