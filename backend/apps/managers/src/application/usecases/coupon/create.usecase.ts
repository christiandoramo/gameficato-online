// apps/customers/src/application/usecases/coupon/create.usecase.ts
import type { Logger } from 'winston';
import { MissingDataException } from '@gameficato/common/exceptions/missing_data.exception';
import type { Coupon } from '@gameficato/managers/domain/entities/coupon.entity';
import type {
  CreateCouponData,
  CouponRepository,
} from '@gameficato/managers/domain/repositories/coupon.repository';
import { CouponAlreadyExistsException } from '@gameficato/managers/application/exceptions/coupon_already_exists.exception';
import type { CouponEventEmitter } from '@gameficato/managers/application/events/coupon.emiiter';

export class CreateCouponUseCase {
  /**
   * Default constructor.
   * @param logger Global logger instance.
   * @param couponRepository Coupon repository.
   * @param couponEventEmitter Coupon event emitter.
   */
  constructor(
    private readonly logger: Logger,
    private readonly couponRepository: CouponRepository,
    private readonly couponEventEmitter: CouponEventEmitter,
  ) {
    this.logger = logger.child({ context: CreateCouponUseCase.name });
  }

  /**
   * Create coupon.
   *
   * @param id Coupon uuid.
   * @param name Coupon name.
   * @param password Coupon password.
   * @param email Coupon email.
   * @returns The created coupon.
   * @throws {MissingDataException} Thrown when any required params are missing.
   * @throws {CouponAlreadyExistsException} Thrown when coupon already exists.
   */
  async execute(coupon: CreateCouponData): Promise<Coupon> {
    const {
      id,
      code,
      coinPrice,
      couponType,
      value,
      validFrom,
      valifUntil,
      stock,
      categories,
    } = coupon;

    // Data input check
    if (!id || !name || !password || !email || !storeId) {
      throw new MissingDataException([
        ...(!id ? ['Id'] : []),
        ...(!code ? ['Code'] : []),
        ...(!value ? ['Value'] : []),
        ...(!couponType ? ['CouponType'] : []),
      ]);
    }

    const existingCoupon = await this.couponRepository.getByCode(code);
    this.logger.debug('Found Coupon by email.', { coupon: existingCoupon });

    // already exist coupon with same code
    if (existingCoupon) {
      throw new CouponAlreadyExistsException(existingCoupon);
    }
    // colocar regras aqui
    const newCoupon = await this.couponRepository.create(coupon);

    this.logger.debug('Coupon created.', { coupon: newCoupon });

    // Fire created coupon
    this.couponEventEmitter.createdCoupon(newCoupon);

    return newCoupon;
  }
}
