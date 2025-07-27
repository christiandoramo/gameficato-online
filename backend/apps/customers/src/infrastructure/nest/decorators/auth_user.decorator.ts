import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { NotImplementedException } from '@gameficato/common/exceptions/not_implemented.exception';
import { NullPointerException } from '@gameficato/common/exceptions/null_pointer.exception';
import { ProtocolType } from '@gameficato/common/helpers/protocol.helper';
import type { AuthUser } from '@gameficato/customers/domain/entities/auth_user.entity';

/**
 * Get request auth user.
 */
export const AuthUserParam = createParamDecorator(
  (Class: any, context: ExecutionContext): AuthUser => {
    let request: any = null;

    const protocol = context.getType();
    if (protocol === ProtocolType.HTTP) {
      const ctx = context.switchToHttp();
      request = ctx.getRequest();
    } else {
      throw new NotImplementedException(
        `Protocol ${protocol} is not implemented.`,
      );
    }

    if (!request.user) {
      throw new NullPointerException(
        'Request user is not defined. Check if JwtAuthGuard is available.',
      );
    }

    return request.user;
  },
);
