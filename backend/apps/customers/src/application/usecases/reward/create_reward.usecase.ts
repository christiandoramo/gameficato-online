// apps/customers/src/application/usecases/reward/create_reward.usecase.ts
import type { Logger } from 'winston';
import { MissingDataException } from '@gameficato/common/exceptions/missing_data.exception';
import type { Reward } from '@gameficato/customers/domain/entities/reward.entity';
import type {
  CreateRewardData,
  RewardRepository,
} from '@gameficato/customers/domain/repositories/reward.repository';
import type { RewardEventEmitter } from '../../events/reward.emitter';

export class CreateRewardUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly repository: RewardRepository,
    private readonly emitter: RewardEventEmitter,
  ) {
    this.logger = logger.child({ context: CreateRewardUseCase.name });
  }

  async execute(data: CreateRewardData): Promise<Reward> {
    this.logger.debug('USECASE: execute called', { data });

    const { coins, inGameCoins, userId, gameId } = data;
    if (coins == null || inGameCoins == null || !userId || gameId == null) {
      throw new MissingDataException(
        ['coins', 'inGameCoins', 'userId', 'gameId'].filter(
          (k) => !(data as any)[k],
        ),
      );
    }

    this.logger.debug('Creating reward', { data });
    const reward = await this.repository.create(data);
    this.logger.info('Reward created', { reward });
    this.emitter.rewardCreated(reward);
    return reward;
  }
}
