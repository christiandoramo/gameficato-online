// apps/api-gateway/src/infrastructure/nest/controllers/user/user.controller.ts

import { Controller, HttpCode, HttpStatus, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Logger } from 'winston';
import { LoggerParam } from '@gameficato/common/decorators/logger.decorator';
import { NatsServiceParam } from '@gameficato/common/decorators/nats_service.decorator';
//import { HTTP_ENDPOINTS } from '../endpoint.constants';
import { GetUserByIdResponse } from '@gameficato/customers/interface/controllers/user/get_by_id.controller';
import { GetUserByIdServiceNats } from '@gameficato/customers/infrastructure/nest/exports/user/get_by_id.service';
import { Public } from '@gameficato/common';

@ApiTags('USERS')
@Controller('users')
export class UserRestController {
  @Get(':id')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiBody({})
  @ApiOkResponse({ type: GetUserByIdResponse })
  @ApiBadRequestResponse({ description: 'Invalid payload.' })
  async findById(
    @Param('id') userId: string,
    @NatsServiceParam(GetUserByIdServiceNats)
    getByIdUserService: GetUserByIdServiceNats,
    @LoggerParam(UserRestController) logger: Logger,
  ): Promise<GetUserByIdResponse> {
    logger.debug('Received HTTP request to get user by i');
    console.log('pegando por id');

    const result = await getByIdUserService.execute({ id: userId });

    logger.debug('User found via NATS.', { result });

    return new GetUserByIdResponse(result);
  }
}
