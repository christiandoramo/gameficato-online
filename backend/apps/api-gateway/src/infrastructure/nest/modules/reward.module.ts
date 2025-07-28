// apps/api-gateway/src/infrastructure/nest/modules/reward.module.ts
import { Module } from '@nestjs/common';
import { RewardRestController } from '../controllers/reward/reward.controller';
import { NatsModule } from '@gameficato/common/modules/rpc.module';
import { CreateRewardServiceNats } from '@gameficato/customers/infrastructure/nest/exports/reward/create.service';

@Module({
  imports: [NatsModule.forFeature([CreateRewardServiceNats])],
  controllers: [RewardRestController],
})
export class RewardModule {}
