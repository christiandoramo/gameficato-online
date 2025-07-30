import type { Reward } from '@gameficato/customers/domain/entities/reward.entity';

export type RewardEvent = Pick<
  Reward,
  'id' | 'coins' | 'inGameCoins' | 'userId' | 'gameId'
>;

export interface RewardEventEmitter {
  createdReward(event: RewardEvent): void;
}
