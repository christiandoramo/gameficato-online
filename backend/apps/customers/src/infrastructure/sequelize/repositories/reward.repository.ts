import { DatabaseRepository } from '@gameficato/common/modules/sequelize.module';
import type { Reward } from '@gameficato/customers/domain/entities/reward.entity';
import type {
  CreateRewardData,
  RewardRepository,
} from '@gameficato/customers/domain/repositories/reward.repository';
import { RewardModel } from '../models/reward.model';

export class RewardDatabaseRepository
  extends DatabaseRepository
  implements RewardRepository
{
  async create(data: CreateRewardData): Promise<Reward> {
    const created = await RewardModel.create(data, {
      transaction: this.transaction,
    });
    return created.get({ plain: true }) as Reward;
  }
}
