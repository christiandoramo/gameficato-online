export interface UserType {
  id: number;
  name: string;
  email: string;
  coins: number;
  userRole: 'storeCustomer' | 'storeAdmin';
  storeId: string;
  inGameCoins: number;
  createdAt: Date;
}