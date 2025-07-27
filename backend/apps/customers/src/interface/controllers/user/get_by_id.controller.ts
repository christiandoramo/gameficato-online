import { Logger } from 'winston';
import { IsEmail, IsString, IsUUID, MaxLength } from 'class-validator';
import { AutoValidator } from '@gameficato/common/utils/validate.util';
import { User } from '@gameficato/customers/domain/entities/user.entity';
import { UserRepository } from '@gameficato/customers/domain/repositories/user.repository';
import { GetUserByIdUseCase } from '@gameficato/customers/application/usecases/user/get_by_id.usecase';
import { filterProperties } from '@gameficato/common/utils/filter_properties.util';

type TGetUserByIdRequest = Pick<User, 'id'>;

export class GetUserByIdRequest
  extends AutoValidator
  implements TGetUserByIdRequest
{
  @IsUUID()
  id: string;

  constructor(props: TGetUserByIdRequest) {
    super(props);
  }
}

type TGetUserByIdResponse = Pick<User, 'id' | 'email' | 'name'>;

export class GetUserByIdResponse
  extends AutoValidator
  implements TGetUserByIdResponse
{
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(255)
  password: string;

  constructor(props: TGetUserByIdResponse) {
    super(
      filterProperties(props, {
        email: null,
        id: null,
        name: null,
        password: null,
      } as TGetUserByIdResponse),
    );
  }
}

export class GetUserByIdController {
  private readonly usecase: GetUserByIdUseCase;

  constructor(
    private readonly logger: Logger,
    userRepository: UserRepository,
  ) {
    this.logger = logger.child({ context: GetUserByIdController.name });
    this.usecase = new GetUserByIdUseCase(this.logger, userRepository);
  }

  async execute(request: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    this.logger.debug('Getting user request.', { request });

    const { id } = request;

    const user = await this.usecase.execute(id);

    if (!user) return null;

    const response = new GetUserByIdResponse(user);

    return response;
  }
}
