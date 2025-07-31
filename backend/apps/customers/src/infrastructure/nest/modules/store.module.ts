// apps/customers/src/infrastructure/nest/modules/store.module.ts

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import {
  ConfigModule,
  LoggerModule,
  ValidationModule,
  DatabaseModule,
  NatsModule,
} from '@gameficato/common';
import { StoreModel } from '../../sequelize/models/store_stub.model';
import { StoreDatabaseRepository } from '../../sequelize/repositories/store.repository';
import { GetAllStoreMicroserviceController } from '../controllers/store/get-all.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: ['.customers.env'] }),
    LoggerModule,
    ValidationModule,
    DatabaseModule.forFeature([StoreModel]),
    NatsModule.forFeature(),
  ],
  providers: [StoreDatabaseRepository],
  controllers: [GetAllStoreMicroserviceController],
})
export class StoreModule {}
