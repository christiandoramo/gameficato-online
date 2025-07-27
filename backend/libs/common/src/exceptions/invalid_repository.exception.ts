import {
  DefaultException,
  Exception,
} from '@gameficato/common/helpers/error.helper';
import { ExceptionTypes } from '@gameficato/common/helpers/error.constants';

@Exception(ExceptionTypes.SYSTEM, 'INVALID_REPOSITORY_EXCEPTION')
export class InvalidRepositoryException extends DefaultException {
  constructor(repositoryName: string) {
    super({
      message: `${repositoryName} must extend DatabaseRepository.`,
      type: ExceptionTypes.SYSTEM,
      code: 'INVALID_REPOSITORY_EXCEPTION',
      data: { repositoryName },
    });
  }
}
