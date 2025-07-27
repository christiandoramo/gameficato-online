import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Game } from '@gameficato/customers/domain/entities/game.entity';

export type GameAttributes = Game;
export type GameCreationAttributes = Pick<
  GameAttributes,
  'title' | 'description'
>;

@Table({
  tableName: 'games',
  timestamps: true,
  underscored: true,
})
export class GameModel extends Model<GameAttributes, GameCreationAttributes> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
