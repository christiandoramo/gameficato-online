export interface Domain<T> {
  id: T;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface UserRole {
  storeCustomer;
  storeAdmin;
  admin;
}

export interface CouponType {
  percent;
  fixed;
}

export interface CouponAcquireType {
  reward;
  purchase;
}
