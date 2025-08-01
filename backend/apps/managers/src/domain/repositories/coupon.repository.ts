// apps/customers/src/domain/repositories/coupon.repository.ts
import type { Coupon } from '@gameficato/managers/domain/entities/coupon.entity';

export type CreateCouponData = Omit<Coupon, 'createdAt'>;
export type UpdateCouponData = Partial<
  Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>
> &
  Pick<Coupon, 'id'>;

export interface CouponRepository {
  /**
   * Creates a new coupon.
   * @param coupon The coupon object to be created, omitting the 'id' field.
   * @returns A promise that resolves to the created Coupon object.
   */
  create(coupon: CreateCouponData): Promise<Coupon>;

  /**
   * Updates an existing coupon.
   * @param coupon The coupon object with updated information, including at least the 'id' field.
   * @returns A promise that resolves to the updated Coupon object.
   */
  update(coupon: UpdateCouponData): Promise<Coupon>;

  /**
   * Retrieves a coupon by their ID.
   * @param id The numeric ID of the coupon to find.
   * @returns A promise that resolves to the Coupon object if found, or null otherwise.
   */
  getById(id: Coupon['id']): Promise<Coupon | null>;

  /**
   * Retrieves all coupons.
   * @returns A promise that resolves to array of Coupon objects.
   */
  getAll(): Promise<Coupon[]>;
}
