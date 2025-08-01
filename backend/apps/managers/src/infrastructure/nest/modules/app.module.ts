import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  LoggerModule,
  ValidationModule,
  DatabaseModule,
  NatsModule,
} from '@gameficato/common';
import { TerminusModule } from '@nestjs/terminus';
import { Logger } from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.managers.env'] }),
    LoggerModule,
    ValidationModule,
    DatabaseModule,
    NatsModule,
    TerminusModule,
  ],
  providers: [Logger],
})
export class AppModule {}
