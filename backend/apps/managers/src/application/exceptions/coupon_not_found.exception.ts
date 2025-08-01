import {
  DefaultException,
  Exception,
} from '@gameficato/common/helpers/error.helper';
import { ExceptionTypes } from '@gameficato/common/helpers/error.constants';
import type { Coupon } from '@gameficato/managers/domain/entities/coupon.entity';

@Exception(ExceptionTypes.USER, 'USER_NOT_FOUND')
export class CouponNotFoundException extends DefaultException {
  constructor(coupon: Partial<Coupon>) {
    super({
      type: ExceptionTypes.USER,
      code: 'COUPON_NOT_FOUND',
      data: coupon,
    });
  }
}
