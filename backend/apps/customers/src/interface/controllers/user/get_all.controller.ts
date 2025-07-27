import { Logger } from 'winston';
import { IsEmail, IsString, IsUUID } from 'class-validator';
import { AutoValidator } from '@gameficato/common/utils/validate.util';
import { IsIsoStringDateFormat } from '@gameficato/common/decorators/validate_iso_string_date_format.decorator';
import { User } from '@gameficato/customers/domain/entities/user.entity';
import { UserRepository } from '@gameficato/customers/domain/repositories/user.repository';
import { GetAllUserUseCase } from '@gameficato/customers/application/usecases/user/get_all.usecase';
import { filterProperties } from '@gameficato/common/utils/filter_properties.util';

type TGetAllUserResponse = Pick<User, 'id' | 'name' | 'email' | 'createdAt'>;

export class GetAllUserResponse
  extends AutoValidator
  implements TGetAllUserResponse
{
  constructor(props: TGetAllUserResponse) {
    super(
      filterProperties(props, {
        email: null,
        id: null,
        name: null,
        createdAt: null,
      } as TGetAllUserResponse),
    );
  }

  @IsUUID()
  id: User['id'];

  @IsString()
  name: User['name'];

  @IsEmail()
  email: User['email'];

  @IsIsoStringDateFormat('YYYY-MM-DDTHH:mm:ss.SSSZ', {
    message: 'Invalid format createdAt',
  })
  createdAt: User['createdAt'];
}

export class GetAllUserController {
  private readonly usecase: GetAllUserUseCase;

  constructor(
    private readonly logger: Logger,
    userRepository: UserRepository,
  ) {
    this.logger = logger.child({
      context: GetAllUserController.name,
    });

    this.usecase = new GetAllUserUseCase(this.logger, userRepository);
  }

  async execute(): Promise<GetAllUserResponse[]> {
    this.logger.info('Get all user request.');

    const result = await this.usecase.execute();

    const response = result.map((user) => new GetAllUserResponse(user));

    this.logger.info('Get all user response.', {
      result: response,
    });

    return response;
  }
}
