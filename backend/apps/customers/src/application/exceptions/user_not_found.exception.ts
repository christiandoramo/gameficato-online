import {
  DefaultException,
  Exception,
} from '@gameficato/common/helpers/error.helper';
import { ExceptionTypes } from '@gameficato/common/helpers/error.constants';
import { User } from '@gameficato/customers/domain/entities/user.entity';

@Exception(ExceptionTypes.USER, 'USER_NOT_FOUND')
export class UserNotFoundException extends DefaultException {
  constructor(user: Partial<User>) {
    super({
      type: ExceptionTypes.USER,
      code: 'USER_NOT_FOUND',
      data: user,
    });
  }
}
