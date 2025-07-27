import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  CreatedAt,
  ForeignKey,
} from 'sequelize-typescript';
import { UserModel } from './user.model';
import { Reward } from '@gameficato/customers/domain/entities/reward.entity';
// import { CouponModel } from './coupon.model';

export type RewardAttributes = Reward;
export type RewardCreationAttributes = Pick<
  RewardAttributes,
  'userId' | 'gameId'
>;

@Table({
  tableName: 'rewards',
  timestamps: false, // vamos controlar só created_at
  underscored: true, // força snake_case
})
export class RewardModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  coins: number;

  @Column({ field: 'in_game_coins', type: DataType.INTEGER, allowNull: false })
  inGameCoins: number;

  @ForeignKey(() => UserModel)
  @Column({ field: 'user_id', type: DataType.UUID, allowNull: false })
  userId: string;

  //   @ForeignKey(() => CouponModel)
  //   @AllowNull
  //   @Column({ field: 'coupon_id', type: DataType.UUID, allowNull: true })
  //   couponId: string | null;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ field: 'game_id', type: DataType.INTEGER, allowNull: false })
  gameId: number;
}
