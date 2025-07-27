import type { Domain } from '@gameficato/common/helpers/domain.helper';

export interface Reward extends Domain<string> {
  coins: number;
  inGameCoins: number;
  userId: string;
  gameId: number;
}

export class RewardEntity implements Reward {
  id: string;
  name: string;
  coins: number;
  inGameCoins: number;
  userId: string;
  gameId: number;

  constructor(props: Reward | Domain<string>) {
    Object.assign(this, props);
  }
}
