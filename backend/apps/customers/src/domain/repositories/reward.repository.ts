import type { Reward } from '../entities/reward.entity';

export type CreateRewardData = Pick<
  Reward,
  'coins' | 'inGameCoins' | 'userId' | 'gameId'
>;

export interface RewardRepository {
  create(data: CreateRewardData): Promise<Reward>;
}
