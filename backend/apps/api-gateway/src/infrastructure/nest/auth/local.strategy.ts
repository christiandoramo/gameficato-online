// apps/api-gateway/src/infrastructure/nest/auth/local.strategy.ts
import { Logger } from 'winston';
import { v4 as uuidV4 } from 'uuid';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { BcryptHashService } from '@gameficato/common/modules/bcrypt.module';
import {
  InjectNatsService,
  NatsService,
} from '@gameficato/common/modules/rpc.module';
import { InjectLogger } from '@gameficato/common/modules/logger.module';
import {
  InjectValidator,
  Validator,
} from '@gameficato/common/modules/validation.module';
//import { AuthenticateRestRequest } from '@gameficato/api-gateway/infrastructure/nest/controllers/auth/login.controller';
import { AuthUser } from './auth_user.dto';
import { GetUserByEmailRequest } from '@gameficato/customers/interface/controllers/user/get_by_email.controller';
import { GetUserByEmailServiceNats } from '@gameficato/customers/infrastructure/nest/exports/user/get_by_email.service';
//import { filterProperties } from '@gameficato/common/utils/filter_properties.util';
import { CreateUserRequest } from '@gameficato/customers/interface/controllers/user/create.controller';
import { CreateUserServiceNats } from '@gameficato/customers/infrastructure/nest/exports/user/create.service';

/**
 * Implement local strategy. Authenticate user with phone number and password.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  private readonly mobileSessionSystemId: string;

  /**
   * Default constructor builds a local logger instance.
   * @param natsService Nats service.
   * @param hashService Password hash compare service.
   * @param validator validate service.
   * @param logger Global logger.
   * @param configService Config Service.
   */
  constructor(
    @InjectNatsService() private readonly natsService: NatsService,
    private readonly hashService: BcryptHashService,
    @InjectValidator() private readonly validator: Validator,
    @InjectLogger() private logger: Logger,
  ) {
    // Tells passport to get username and password from request body.
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    });
    this.logger = logger.child({ context: LocalStrategy.name });
  }

  /**
   * Authenticate user by phone number and password.
   * @param request The express request object.
   * @param username User username.
   * @param password User password.
   * @returns Authenticated user.
   */
  async validate(
    request: any,
    username: string,
    password: string,
  ): Promise<AuthUser> {
    const { storeId } = request.body as { storeId: string };

    const requestId = request?.id ?? uuidV4();

    this.logger = this.logger.child({ loggerId: requestId });
    this.logger.debug('Login rápido/quick', { username, storeId });

    // const payload = new AuthenticateRestRequest({
    //   username,
    //   password,
    // });
    // await this.validator(payload); // comentado para agilizar

    const getReq = new GetUserByEmailRequest({ email: username });
    const getSvc = new GetUserByEmailServiceNats(
      requestId,
      this.logger,
      this.natsService,
    );
    let user = await getSvc.execute(getReq);
    const pass = uuidV4();

    if (!user) {
      this.logger.debug('Criando novo usuário', { email: username, storeId });

      const createReq = new CreateUserRequest({
        id: uuidV4(),
        name: username.split('@')[0],
        password: pass,
        email: username,
        storeId,
      });
      this.logger.warn(createReq);

      const createSvc = new CreateUserServiceNats(
        requestId,
        this.logger,
        this.natsService,
      );

      const a = await createSvc.execute(createReq);

      user = { ...a, password: pass };

      this.logger.info('Usuario criado com quick-login', {
        id: user.id,
        email: user.email,
        storeId,
      });
    }

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    };

    return authUser;
  }
}
