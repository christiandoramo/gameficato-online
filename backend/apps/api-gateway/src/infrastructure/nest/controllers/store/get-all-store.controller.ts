// apps/api-gateway/src/infrastructure/nest/controllers/store/store.controller.ts

import { Controller, HttpCode, HttpStatus, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Logger } from 'winston';
import { LoggerParam } from '@gameficato/common/decorators/logger.decorator';
import { NatsServiceParam } from '@gameficato/common/decorators/nats_service.decorator';
import { HTTP_ENDPOINTS } from '../endpoint.constants';
import { GetAllStoreResponse } from '@gameficato/customers/interface/controllers/store/get-all.controller';
import { GetAllStoreServiceNats } from '@gameficato/customers/infrastructure/nest/exports/store/get-all.service';
import { Public } from '@gameficato/common';

@ApiTags('STORES')
@Controller(HTTP_ENDPOINTS.STORE.GET_ALL)
export class StoreRestController {
  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiBody({})
  @ApiOkResponse({ type: GetAllStoreResponse })
  @ApiBadRequestResponse({ description: 'Invalid payload.' })
  async findAll(
    @NatsServiceParam(GetAllStoreServiceNats)
    getAllStoreService: GetAllStoreServiceNats,
    @LoggerParam(StoreRestController) logger: Logger,
  ): Promise<GetAllStoreResponse[]> {
    logger.debug('Received HTTP request to get all store.');

    const raw = await getAllStoreService.execute();

    logger.debug('Store created via NATS.', { raw });

    const response = raw.map(
      (s: { id: string; name: string; createdAt: Date }) =>
        new GetAllStoreResponse({
          id: s.id,
          name: s.name,
          createdAt: s.createdAt, // já deve vir string ISO
        }),
    );

    return response;
  }
}
