// apps/customers/src/interface/events/reward.emitter.ts

import { IsUUID, IsInt, Min } from 'class-validator';
import { AutoValidator } from '@gameficato/common/utils/validate.util';
import {
  RewardEvent,
  RewardEventEmitter,
} from '@gameficato/customers/application/events/reward.emitter';

/**
 * Tipos de evento para Reward.
 */
export enum RewardEventType {
  CREATED = 'CREATED',
}

/**
 * Payload do controller antes de enviar ao emitter.
 */
type TRewardControllerEvent = Pick<
  RewardEvent,
  'id' | 'coins' | 'inGameCoins' | 'userId' | 'gameId'
>;

export class RewardControllerEvent
  extends AutoValidator
  implements TRewardControllerEvent
{
  @IsUUID()
  id: string;

  @IsInt()
  @Min(0)
  coins: number;

  @IsInt()
  @Min(0)
  inGameCoins: number;

  @IsUUID()
  userId: string;

  @IsInt()
  gameId: number;

  constructor(props: TRewardControllerEvent) {
    super(props);
    Object.assign(this, props);
  }
}

/**
 * Interface que o Emitter real deve implementar.
 */
export interface RewardEventEmitterControllerInterface {
  /**
   * Emite um evento de Reward.
   * @param eventName Tipo de evento.
   * @param event Dados do evento.
   */
  emitRewardEvent(
    eventName: RewardEventType,
    event: RewardControllerEvent,
  ): void;
}

/**
 * Controller que adapta os eventos de domínio para o Emitter de NATS.
 */
export class RewardEventEmitterController implements RewardEventEmitter {
  constructor(
    private readonly eventEmitter: RewardEventEmitterControllerInterface,
  ) {}

  /**
   * Emite o evento CREATED após criar um Reward.
   */
  // createdReward(event: RewardEvent): void {
  //   const controllerEvent = this.formatData(event);
  //   this.eventEmitter.emitRewardEvent(RewardEventType.CREATED, controllerEvent);
  // }
  createdReward(event: RewardEvent): void {
    const controllerEvent = this.formatData(event);
    this.eventEmitter.emitRewardEvent(RewardEventType.CREATED, controllerEvent);
  }
  /** Formata os dados de domínio para o DTO de evento. */
  private formatData(event: RewardEvent): RewardControllerEvent {
    return new RewardControllerEvent({
      id: event.id,
      coins: event.coins,
      inGameCoins: event.inGameCoins,
      userId: event.userId,
      gameId: event.gameId,
    });
  }
}
