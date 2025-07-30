// apps/api-gateway/src/infrastructure/nest/modules/app.module.ts
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { JwtModule } from '@gameficato/common/modules/jwt.module';
import { NatsModule } from '@gameficato/common/modules/rpc.module';
import { LoggerMiddleware } from '@gameficato/common/middlewares/logger.middleware';
import { LoggerModule } from '@gameficato/common/modules/logger.module';
import { RequestIdMiddleware } from '@gameficato/common/middlewares/request_id.middleware';
import { BcryptModule } from '@gameficato/common/modules/bcrypt.module';
import { ValidationModule } from '@gameficato/common/modules/validation.module';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';
import { RewardModule } from './reward.module';

@Module({
  providers: [Logger],
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.api-gateway.env'] }),
    NatsModule,
    JwtModule,
    BcryptModule,
    ValidationModule,
    LoggerModule,
    AuthModule,
    UserModule,
    TerminusModule,
    RewardModule,
  ],
})
export class AppModule implements NestModule {
  /**
   * Add middlewares to nest app.
   * @param consumer Nest middleware manager.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware, LoggerMiddleware).forRoutes('*');
  }
}
