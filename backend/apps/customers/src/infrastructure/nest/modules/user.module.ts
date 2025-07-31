import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BcryptModule } from '@gameficato/common/modules/bcrypt.module';
import { DatabaseModule } from '@gameficato/common/modules/sequelize.module';
import { NatsModule } from '@gameficato/common/modules/rpc.module';
import { LoggerModule } from '@gameficato/common/modules/logger.module';
import { ValidationModule } from '@gameficato/common/modules/validation.module';
import { UpdateUserMicroserviceController } from '@gameficato/customers/infrastructure/nest/controllers/user/update.controller';
import { UserModel } from '@gameficato/customers/infrastructure/sequelize/models/user.model';
import { CreateUserMicroserviceController } from '@gameficato/customers/infrastructure/nest/controllers/user/create.controller';
import { GetUserByEmailMicroserviceController } from '@gameficato/customers/infrastructure/nest/controllers/user/get_by_email.controller';
import { ChangeUserPasswordMicroserviceController } from '@gameficato/customers/infrastructure/nest/controllers/user/change_password.controller';
import { GetUserByIdMicroserviceController } from '@gameficato/customers/infrastructure/nest/controllers/user/get_by_id.controller';
import { GetAllUserMicroserviceController } from '@gameficato/customers/infrastructure/nest/controllers/user/get_all.controller';
import { UserEventNatsEmitter } from '../events/user.emitter';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    LoggerModule,
    ValidationModule,
    NatsModule.forFeature([UserEventNatsEmitter]),
    BcryptModule,
    DatabaseModule.forFeature([UserModel]),
  ],
  controllers: [
    UpdateUserMicroserviceController,
    CreateUserMicroserviceController,
    GetUserByEmailMicroserviceController,
    ChangeUserPasswordMicroserviceController,
    GetUserByIdMicroserviceController,
    GetAllUserMicroserviceController,
  ],
})
export class UserModule {}
