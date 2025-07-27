import {
  DefaultException,
  Exception,
} from '@gameficato/common/helpers/error.helper';
import { ExceptionTypes } from '@gameficato/common/helpers/error.constants';

@Exception(ExceptionTypes.FORBIDDEN, 'FORBIDDEN')
export class ForbiddenException extends DefaultException {
  constructor(data?: any) {
    super({
      message: 'Forbidden',
      type: ExceptionTypes.FORBIDDEN,
      code: 'FORBIDDEN',
      data,
    });
  }
}
