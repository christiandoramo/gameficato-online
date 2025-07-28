// apps/api-gateway/src/infrastructure/nest/modules/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { BcryptModule } from '@gameficato/common/modules/bcrypt.module';
import { NatsModule } from '@gameficato/common/modules/rpc.module';
import { JwtModule } from '@gameficato/common/modules/jwt.module';
import { LoggerModule } from '@gameficato/common/modules/logger.module';
import { ValidationModule } from '@gameficato/common/modules/validation.module';
import { LocalStrategy } from '@gameficato/api-gateway/infrastructure/nest/auth/local.strategy';
import { JwtStrategy } from '@gameficato/api-gateway/infrastructure/nest/auth/jwt.strategy';
import { LoginAuthRestController } from '@gameficato/api-gateway/infrastructure/nest/controllers/auth/login.controller';
import { AccessTokenProvider } from '@gameficato/api-gateway/infrastructure/nest/auth/access_token.provider';
import { JwtGuard } from '@gameficato/api-gateway/infrastructure/nest/auth/jwt.guard';
import { ChangeUserPasswordRestController } from '@gameficato/api-gateway/infrastructure/nest/controllers/auth/change_password.controller';
import { ChangeUserPasswordServiceNats } from '@gameficato/customers/infrastructure/nest/exports/user/change_password.service';

/**
 * Authentication endpoints module.
 */
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync(),
    NatsModule.forFeature([ChangeUserPasswordServiceNats]),
    LoggerModule,
    PassportModule,
    BcryptModule,
    ValidationModule,
  ],
  controllers: [LoginAuthRestController, ChangeUserPasswordRestController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    LocalStrategy,
    JwtStrategy,
    AccessTokenProvider,
  ],
})
export class AuthModule {}
