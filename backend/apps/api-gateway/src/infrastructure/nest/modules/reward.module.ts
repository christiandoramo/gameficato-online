// apps/api-gateway/src/infrastructure/nest/modules/reward.module.ts
import { Module } from '@nestjs/common';
import { RewardRestController } from '../controllers/reward/reward.controller';
import { NatsModule } from '@gameficato/common/modules/rpc.module';
import { CreateRewardServiceNats } from '@gameficato/customers/infrastructure/nest/exports/reward/create.service';
import {
  LoggerModule,
  BcryptModule,
  ValidationModule,
} from '@gameficato/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    NatsModule.forFeature([CreateRewardServiceNats]),
    BcryptModule,
    ValidationModule,

  ],
  controllers: [RewardRestController],
})
export class RewardModule {}
