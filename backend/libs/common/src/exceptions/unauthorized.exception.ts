import {
  DefaultException,
  Exception,
} from '@gameficato/common/helpers/error.helper';
import { ExceptionTypes } from '@gameficato/common/helpers/error.constants';

@Exception(ExceptionTypes.UNAUTHORIZED, 'UNAUTHORIZED')
export class UnauthorizedException extends DefaultException {
  constructor(data?: any) {
    super({
      message: 'Unauthorized request',
      type: ExceptionTypes.UNAUTHORIZED,
      code: 'UNAUTHORIZED',
      data,
    });
  }
}
