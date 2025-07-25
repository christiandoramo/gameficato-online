import { Agent } from 'node:https';
import type { Logger } from 'winston';
import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { NotImplementedException } from '../exceptions/not_implemented.exception';
import { NullPointerException } from '../exceptions/null_pointer.exception';
import { ProtocolType } from '../helpers/protocol.helper';

interface RestServiceDefault {
  new (id: string, logger: Logger);
}

export const axiosCreate = (baseURL: string): AxiosInstance =>
  axios.create({
    baseURL,
    httpsAgent: new Agent({ rejectUnauthorized: false }),
  });

/**
 * Get RestService.
 */
export const RestServiceParam = createParamDecorator(
  (RestService: any, context: ExecutionContext): RestServiceDefault => {
    let request: any = null;

    const protocol = context.getType();
    if (protocol === ProtocolType.HTTP) {
      const ctx = context.switchToHttp();
      request = ctx.getRequest();
    } else if (protocol === ProtocolType.RPC) {
      const ctx = context.switchToRpc();
      request = ctx.getContext();
    } else {
      throw new NotImplementedException(
        `Protocol ${protocol} is not implemented.`,
      );
    }

    const { id, logger } = request;

    if (!id || !logger) {
      throw new NullPointerException(
        `Request id, logger. 
        Check if RequestIdInterceptor, LoggerInterceptor are available.`,
      );
    }

    return new RestService(id, logger);
  },
);
