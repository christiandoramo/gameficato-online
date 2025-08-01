import type {
  Domain,
  CouponType,
} from '@gameficato/common/helpers/domain.helper';

export interface Coupon extends Domain<string> {
  storeId: string;
  code: string;
  couponType: CouponType;
  validFrom: Date;
  valifUntil: Date;
  description?: string;
  value: number;
  categories: string;
  stock: number;
  coinPrice: number;
}

export class CouponEntity implements Coupon {
  id: string;
  storeId: string;
  code: string;
  couponType: CouponType;
  validFrom: Date;
  valifUntil: Date;
  description?: string;
  value: number;
  categories: string;
  stock: number;
  coinPrice: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(props: Coupon | Domain<string>) {
    Object.assign(this, props);
  }
}
