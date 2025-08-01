import type { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { createNatsTransport } from '@gameficato/common/modules/rpc.module';
import {
  ConsoleLoggerModule,
  LOGGER_SERVICE,
  LOGGER_SERVICE_PROVIDER,
} from '@gameficato/common/modules/logger.module';
import { shutdown } from '@gameficato/common/utils/shutdown.util';
import { AppModule } from './infrastructure/nest/modules/app.module';

let app: INestApplication = null;
declare const _BUILD_INFO_: any;

async function bootstrap() {
  app = await NestFactory.create(AppModule, {
    logger: new ConsoleLoggerModule(),
  });

  const configService = app.get(ConfigService);
  const logger: Logger = app.get(LOGGER_SERVICE);

  // Set default logger.
  app.useLogger(app.get(LOGGER_SERVICE_PROVIDER));

  // Log build info.
  logger.info('Build info.', { info: _BUILD_INFO_ });

  // Enable graceful shutdown
  app.enableShutdownHooks();

  await app.init();

  const service = app.connectMicroservice(
    createNatsTransport(configService, logger),
  );

  await service.listen();

  logger.info('Microservice MANAGERS NATS successfully started');
}

bootstrap().catch((error) => shutdown(app, error));
