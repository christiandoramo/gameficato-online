import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  CreatedAt,
} from 'sequelize-typescript';
import {
  Store,
  StoreEntity,
} from '@gameficato/customers/domain/entities/store.entity';
import { BuildOptions } from 'sequelize';

export type StoreAttributes = Store;
export type StoreCreationAttributes = Pick<StoreAttributes, 'name'>;

@Table({
  tableName: 'store_stub',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class StoreModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column({ unique: true, type: DataType.UUID, allowNull: false })
  name: string;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt: Date;

  constructor(values?: StoreCreationAttributes, options?: BuildOptions) {
    super(values, options);
  }
  toDomain(): Store {
    return new StoreEntity(this.get({ plain: true }));
  }
}
