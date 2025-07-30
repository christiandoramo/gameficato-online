// apps/customers/src/infrastructure/nest/modules/app.module.ts
import { ConfigModule } from '@nestjs/config';
import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from '@gameficato/common/modules/logger.module';
import { UserModule } from './user.module';
import { RewardModule } from '@gameficato/customers/infrastructure/nest/modules/reward.module';
import {
  DatabaseModule,
  NatsModule,
  ValidationModule,
} from '@gameficato/common';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.customers.env'] }),
    LoggerModule,
    ValidationModule,
    DatabaseModule,
    NatsModule, // ← e isto aqui
    TerminusModule,
    UserModule,
    RewardModule,
  ],
  providers: [Logger],
})
export class AppModule {}
