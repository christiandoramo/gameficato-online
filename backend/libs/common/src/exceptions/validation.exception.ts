import {
  DefaultException,
  Exception,
} from '@gameficato/common/helpers/error.helper';
import { ExceptionTypes } from '@gameficato/common/helpers/error.constants';
import { ValidationError } from 'class-validator';

@Exception(ExceptionTypes.USER, 'VALIDATION')
export class ValidationException extends DefaultException {
  static readonly code = 'VALIDATION';

  constructor(errors: ValidationError[]) {
    super({
      message: 'Invalid data',
      type: ExceptionTypes.USER,
      code: ValidationException.code,
      data: errors,
    });
  }
}
