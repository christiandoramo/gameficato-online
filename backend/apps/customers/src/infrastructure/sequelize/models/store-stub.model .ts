// apps/customers/src/infrastructure/sequelize/models/store-stub.model .ts

import { BuildOptions } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import {
  User,
  UserEntity,
} from '@gameficato/customers/domain/entities/user.entity';
import { Store } from '@gameficato/customers/domain/entities/store.entity';

export type StoreAttributes = Store;
export type StoreCreationAttributes = Pick<StoreAttributes, 'name'>;

@Table({
  tableName: 'store_stub',
  timestamps: true,
  paranoid: true,
})
export class StoreModel
  extends Model<StoreAttributes, StoreCreationAttributes>
  implements Store
{
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  constructor(values?: StoreCreationAttributes, options?: BuildOptions) {
    super(values, options);
  }

  /**
   * Converts this model to an entity.
   * @returns An entity.
   */
  toDomain(): User {
    return new UserEntity(this.get({ plain: true }));
  }
}
