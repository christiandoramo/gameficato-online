// apps/api-gateway/src/infrastructure/nest/controllers/reward/dto/create-reward.body.ts
import { IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRewardDto {
  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  coins: number;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  inGameCoins: number;

  @ApiProperty({ example: '9e744cd9-e72a-41a0-bbbf-766c4763213e' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  gameId: number;
}
