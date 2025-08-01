// apps/customers/src/application/events/coupon.emitter.ts
import type { Coupon } from '@gameficato/managers/domain/entities/coupon.entity';

export type CouponEvent = Pick<Coupon, 'id' | 'code' | 'value' | 'couponType'>;

export interface CouponEventEmitter {
  /**
   * Emit creatd coupon event.
   * @param event event to fire.
   */
  createdCoupon: (event: CouponEvent) => void;

  /**
   * Emit updated coupon event.
   * @param event event to fire.
   */
  updatedCoupon: (event: CouponEvent) => void;
}
