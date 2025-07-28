// apps/customers/src/infrastructure/nest/modules/reward.module.ts

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { BcryptModule } from '@gameficato/common/modules/bcrypt.module';
import { DatabaseModule } from '@gameficato/common/modules/sequelize.module';
import { NatsModule } from '@gameficato/common/modules/rpc.module';
import { LoggerModule } from '@gameficato/common/modules/logger.module';
import { ValidationModule } from '@gameficato/common/modules/validation.module';

import { CreateRewardMicroserviceController } from '../controllers/reward/create.controller';
import { RewardModel } from '../../sequelize/models/reward.model';
import { RewardDatabaseRepository } from '../../sequelize/repositories/reward.repository';
import { RewardEventNatsEmitter } from '../events/reward.emitter';
import { UserModule } from './user.module';
import { RewardEventEmitterController } from '@gameficato/customers/interface/events/reward.emitter';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    LoggerModule,
    ValidationModule,
    // aqui você precisa registrar o seu emitter
    NatsModule.forFeature([RewardEventNatsEmitter]),
    BcryptModule,
    DatabaseModule.forFeature([RewardModel]),
    UserModule,
  ],
  controllers: [CreateRewardMicroserviceController],
  providers: [
    RewardDatabaseRepository,
    RewardEventEmitterController, // interface → domínio
    RewardEventNatsEmitter,
  ],
})
export class RewardModule {}
