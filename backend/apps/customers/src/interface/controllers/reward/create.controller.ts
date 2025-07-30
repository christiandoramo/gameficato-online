// apps/customers/src/interface/controllers/reward/create.controller.ts
import { Logger } from 'winston';
import { IsUUID, IsInt, Min } from 'class-validator';
import { AutoValidator } from '@gameficato/common/utils/validate.util';
import { Reward } from '@gameficato/customers/domain/entities/reward.entity';
import { RewardRepository } from '@gameficato/customers/domain/repositories/reward.repository';
import { CreateRewardUseCase } from '@gameficato/customers/application/usecases/reward/create_reward.usecase';
import { filterProperties } from '@gameficato/common/utils/filter_properties.util';
import { Type } from 'class-transformer';
import {
  RewardEventEmitterController,
  RewardEventEmitterControllerInterface,
} from '../../events/reward.emitter';
import { UserRepository } from '@gameficato/customers/domain/repositories/user.repository';

export type TCreateRewardRequest = Pick<
  Reward,
  'coins' | 'inGameCoins' | 'userId' | 'gameId'
>;

export class CreateRewardRequest
  extends AutoValidator
  implements TCreateRewardRequest
{
  @Type(() => Number)
  @IsInt()
  @Min(0)
  coins: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  inGameCoins: number;

  @IsUUID()
  userId: string;

  @Type(() => Number)
  @IsInt()
  gameId: number;

  constructor(props: TCreateRewardRequest) {
    super(props);
    Object.assign(this, props);
  }
}

export type TCreateRewardResponse = Pick<
  Reward,
  'id' | 'coins' | 'inGameCoins' | 'userId' | 'gameId'
>;

export class CreateRewardResponse
  extends AutoValidator
  implements TCreateRewardResponse
{
  @IsUUID() id: string;
  @IsInt() coins: number;
  @IsInt() inGameCoins: number;
  @IsUUID() userId: string;
  @IsInt() gameId: number;

  constructor(props: TCreateRewardResponse) {
    super(
      filterProperties(props, {
        id: null,
        coins: null,
        inGameCoins: null,
        userId: null,
        gameId: null,
      } as TCreateRewardResponse),
    );
  }
}

export class CreateRewardController {
  private readonly usecase: CreateRewardUseCase;
  constructor(
    private readonly logger: Logger,
    repoReward: RewardRepository,
    repoUser: UserRepository,
    emitter: RewardEventEmitterControllerInterface,
  ) {
    this.logger = logger.child({ context: CreateRewardController.name });

    const rewardEventEmitter = new RewardEventEmitterController(emitter);

    this.usecase = new CreateRewardUseCase(
      logger,
      repoReward,
      repoUser,
      rewardEventEmitter,
    );
  }

  async execute(request: CreateRewardRequest): Promise<CreateRewardResponse> {
    this.logger.debug('CreateReward request', { request });
    const reward = await this.usecase.execute(request);
    this.logger.info('CreateReward response', { reward });
    return new CreateRewardResponse(reward);
  }
}
