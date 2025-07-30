// apps/customers/src/application/usecases/reward/create_reward.usecase.ts
import type { Logger } from 'winston';
import { MissingDataException } from '@gameficato/common/exceptions/missing_data.exception';
import type { Reward } from '@gameficato/customers/domain/entities/reward.entity';
import type {
  CreateRewardData,
  RewardRepository,
} from '@gameficato/customers/domain/repositories/reward.repository';
import type { RewardEventEmitter } from '../../events/reward.emitter';
import { InvalidDataFormatException } from '@gameficato/common';
import type {
  UpdateUserData,
  UserRepository,
} from '@gameficato/customers/domain/repositories/user.repository';

export class CreateRewardUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly repository: RewardRepository,
    private readonly userRepo: UserRepository,
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

    if (coins < 0 || inGameCoins < 0)
      throw new InvalidDataFormatException(
        ['coins', 'inGameCoins'].filter((k) => !(data as any)[k]),
      );

    this.logger.debug('Creating reward', { data });
    const reward = await this.repository.create(data);
    this.logger.info('Reward created', { reward });

    // 2) busca usuário e soma os coins
    this.logger.debug('USECASE: fetching user for update', { userId });
    const user = await this.userRepo.getById(userId);
    if (!user) {
      this.logger.error('USECASE: user not found, rolling back', { userId });
      throw new MissingDataException(['userId']);
    }

    const updatedData: UpdateUserData = {
      id: userId,
      coins: (user.coins ?? 0) + coins,
      inGameCoins: (user.inGameCoins ?? 0) + inGameCoins,
    };
    this.logger.debug('USECASE: updating user coins and inGameCoins', {
      before: { coins: user.coins, inGameCoins: user.inGameCoins },
      added: { coins, inGameCoins },
      after: updatedData,
    });
    const updatedUser = await this.userRepo.update(updatedData);
    this.logger.info(
      'USECASE: usuaário atualizado com nova coins e inGameCOins',
      { updatedUser },
    );

    this.emitter.createdReward(reward);
    return reward;
  }
}
