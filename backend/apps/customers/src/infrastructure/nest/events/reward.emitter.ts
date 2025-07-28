// apps/customers/src/infrastructure/nest/events/reward.emitter.ts
import { Logger } from 'winston';
import { NatsEventEmitter } from '@gameficato/common/interceptors/nats_event.interceptor';
import { NatsMessage } from '@gameficato/common/helpers/nats_message.helper';
import { NatsAddEvent } from '@gameficato/common/modules/rpc.module';
import { NATS_EVENTS } from '@gameficato/customers/infrastructure/nats/nats.constants';
import {
  RewardControllerEvent,
  RewardEventEmitterControllerInterface,
  RewardEventType,
} from '@gameficato/customers/interface/events/reward.emitter';

const eventMapper = NATS_EVENTS.REWARD;

type RewardNatsEvent = NatsMessage<RewardControllerEvent>;

/**
 * User microservice.
 */
@NatsAddEvent(Object.values(eventMapper))
export class RewardEventNatsEmitter
  implements RewardEventEmitterControllerInterface
{
  /**
   * Default constructor.
   * @param requestId Unique shared request ID.
   * @param eventEmitter Client to access Nats.
   * @param logger Global logger.
   */
  constructor(
    private readonly requestId: string,
    private readonly eventEmitter: NatsEventEmitter,
    private readonly logger: Logger,
  ) {
    this.logger = logger.child({ context: RewardEventNatsEmitter.name });
  }

  /**
   * Call  to emit message.
   * @param eventName The event name.
   * @param event The event data.
   */
  emitRewardEvent(
    eventName: RewardEventType,
    event: RewardControllerEvent,
  ): void {
    // Request Nats message.
    const data: RewardNatsEvent = {
      key: `${event.uuid}`,
      headers: { requestId: this.requestId },
      value: event,
    };

    this.logger.debug('Emit Reward event.', { eventName, data });

    // Call create PixDecodedAccount microservice.
    const result = this.eventEmitter.emit({
      name: eventMapper[eventName],
      data,
    });

    this.logger.debug('Reward event emitted.', { result });
  }
}
