// apps/customers/src/infrastructure/nest/modules/reward.module.ts

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import {
  ConfigModule,
  LoggerModule,
  ValidationModule,
  DatabaseModule,
  NatsModule,
} from '@gameficato/common';
import { CreateRewardMicroserviceController } from '../controllers/reward/create.controller';
import { RewardModel } from '../../sequelize/models/reward.model';
import { RewardDatabaseRepository } from '../../sequelize/repositories/reward.repository';
import { UserDatabaseRepository } from '../../sequelize/repositories/user.repository';
import { UserModule } from './user.module';
import { RewardEventNatsEmitter } from '../events/reward.emitter';
import { RewardEventEmitterController } from '@gameficato/customers/interface/events/reward.emitter';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: ['.customers.env'] }),
    LoggerModule,
    ValidationModule,
    DatabaseModule.forFeature([RewardModel]),
    NatsModule.forFeature([RewardEventNatsEmitter]),
    UserModule,
  ],
  controllers: [CreateRewardMicroserviceController],
})
export class RewardModule {}
