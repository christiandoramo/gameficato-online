// apps/api-gateway/src/infrastructure/nest/modules/user.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BcryptModule } from '@gameficato/common/modules/bcrypt.module';
import { NatsModule } from '@gameficato/common/modules/rpc.module';
import { LoggerModule } from '@gameficato/common/modules/logger.module';
import { ValidationModule } from '@gameficato/common/modules/validation.module';

/**
 * User endpoint modules.
 */
@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    NatsModule.forFeature([]),
    BcryptModule,
    ValidationModule,
  ],
  controllers: [],
})
export class UserModule {}
