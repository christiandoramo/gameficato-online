import { Logger } from 'winston';
import { IsUUID, IsString, IsEmail } from 'class-validator';
import { AutoValidator } from '@gameficato/common/utils/validate.util';
import { User } from '@gameficato/customers/domain/entities/user.entity';
import { UserRepository } from '@gameficato/customers/domain/repositories/user.repository';
import { ChangeUserPasswordUseCase } from '@gameficato/customers/application/usecases/user/change_password.usecase';
import { filterProperties } from '@gameficato/common/utils/filter_properties.util';

type UserId = User['id'];
type Password = User['password'];

type TChangeUserPasswordRequest = {
  id: UserId;
  password: Password;
};

export class ChangeUserPasswordRequest
  extends AutoValidator
  implements TChangeUserPasswordRequest
{
  @IsUUID()
  id: string;

  @IsString()
  password: Password;

  constructor(props: TChangeUserPasswordRequest) {
    super(props);
  }
}

type TChangeUserPasswordResponse = Pick<User, 'id' | 'name' | 'email'>;

export class ChangeUserPasswordResponse
  extends AutoValidator
  implements TChangeUserPasswordResponse
{
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  constructor(props: TChangeUserPasswordResponse) {
    super(
      filterProperties(props, {
        email: null,
        id: null,
        name: null,
      } as TChangeUserPasswordResponse),
    );
  }
}

export class ChangeUserPasswordController {
  private usecase: ChangeUserPasswordUseCase;

  constructor(
    private logger: Logger,
    userRepository: UserRepository,
  ) {
    this.logger = logger.child({
      context: ChangeUserPasswordController.name,
    });
    this.usecase = new ChangeUserPasswordUseCase(this.logger, userRepository);
  }

  async execute(
    request: ChangeUserPasswordRequest,
  ): Promise<ChangeUserPasswordResponse> {
    this.logger.debug('Change user password request.', { request });

    const { id, password } = request;

    const user = await this.usecase.execute(id, password);

    const response = new ChangeUserPasswordResponse(user);

    this.logger.info('Change user password response.', { user: response });

    return response;
  }
}
