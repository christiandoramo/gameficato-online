// apps/api-gateway/src/infrastructure/nest/modules/store.module.ts
import { Module } from '@nestjs/common';
import { StoreRestController } from '../controllers/store/get-all-store.controller';
import { NatsModule } from '@gameficato/common/modules/rpc.module';
import {
  LoggerModule,
  BcryptModule,
  ValidationModule,
} from '@gameficato/common';
import { ConfigModule } from '@nestjs/config';
import { GetAllStoreServiceNats } from '@gameficato/customers/infrastructure/nest/exports/store/get-all.service';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    NatsModule.forFeature([GetAllStoreServiceNats]),
    BcryptModule,
    ValidationModule,
  ],
  controllers: [StoreRestController],
})
export class StoreModule {}
