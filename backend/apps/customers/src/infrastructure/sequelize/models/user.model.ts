// apps/customers/src/infrastructure/sequelize/models/user.model.ts

import { BuildOptions } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import {
  User,
  UserEntity,
} from '@gameficato/customers/domain/entities/user.entity';
import { StoreModel } from './store_stub.model';

export type UserAttributes = User;
export type UserCreationAttributes = Pick<
  UserAttributes,
  'name' | 'email' | 'password' | 'storeId'
>;

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
export class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements User
{
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  email: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  coins: number;

  @Column({
    field: 'in_game_coins',
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  inGameCoins: number;

  @ForeignKey(() => StoreModel) // supondo que haja um StoreModel
  @Column({
    defaultValue: 'a1b2c3d4-e5f6-7890-abcd-ef0123456789', // MERCATO ONLINE - mvp
    field: 'store_id',
    type: DataType.UUID,
    allowNull: false,
  })
  storeId: string;

  @Column({
    field: 'user_role',
    type: DataType.ENUM('store_customer', 'store_admin', 'admin'),
    allowNull: false,
    defaultValue: 'store_customer',
  })
  userRole: 'store_customer' | 'store_admin' | 'admin';

  constructor(values?: UserCreationAttributes, options?: BuildOptions) {
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
