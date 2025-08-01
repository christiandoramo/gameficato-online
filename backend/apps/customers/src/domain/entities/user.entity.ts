import type { Domain, UserRole } from '@gameficato/common/helpers';

export interface User extends Domain<string> {
  name: string;
  email: string;
  password: string;
  coins: number;
  inGameCoins: number;
  storeId: string;
  userRole: UserRole;
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
  userRole: UserRole;

  constructor(props: User | Domain<string>) {
    Object.assign(this, props);
  }
}
