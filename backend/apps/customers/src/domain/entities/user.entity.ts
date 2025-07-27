import type { Domain } from '@gameficato/common/helpers/domain.helper';

export interface User extends Domain<string> {
  name: string;
  email: string;
  password: string;
}

export class UserEntity implements User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  coins: number;
  inGameCoins: number;
  storeId: string;
  userRole: 'store_customer' | 'store_admin' | 'admin';

  constructor(props: User | Domain<string>) {
    Object.assign(this, props);
  }
}
