// apps/api-gateway/src/infrastructure/nest/controllers/reward/reward.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Logger } from 'winston';
import { LoggerParam } from '@gameficato/common/decorators/logger.decorator';
import { NatsServiceParam } from '@gameficato/common/decorators/nats_service.decorator';
import { HTTP_ENDPOINTS } from '../endpoint.constants';
import { CreateRewardServiceNats } from '@gameficato/customers/infrastructure/nest/exports/reward/create.service';
import {
  CreateRewardRequest as DomainCreateRewardRequest,
  CreateRewardResponse,
} from '@gameficato/customers/interface/controllers/reward/create.controller';
import { Type } from 'class-transformer';
import { IsUUID, IsInt, Min } from 'class-validator';

class CreateRewardDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  coins: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  inGameCoins: number;

  @IsUUID()
  userId: string;

  @Type(() => Number)
  @IsInt()
  gameId: number;
}

@ApiTags('Recompensas')
@Controller(HTTP_ENDPOINTS.REWARD.CREATE)
export class RewardRestController {
  @Post()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateRewardDto })
  @ApiCreatedResponse({ type: CreateRewardResponse })
  @ApiBadRequestResponse({ description: 'Invalid payload.' })
  async create(
    @Body() body: CreateRewardDto,
    @NatsServiceParam(CreateRewardServiceNats)
    createRewardService: CreateRewardServiceNats,
    @LoggerParam(RewardRestController) logger: Logger,
  ): Promise<CreateRewardResponse> {
    logger.debug('Received HTTP request to create reward.', { body });

    const payload: DomainCreateRewardRequest = {
      coins: body.coins,
      inGameCoins: body.inGameCoins,
      userId: body.userId,
      gameId: body.gameId,
    };

    const result = await createRewardService.execute(payload);

    logger.debug('Reward created via NATS.', { result });

    return new CreateRewardResponse(result);
  }
}
