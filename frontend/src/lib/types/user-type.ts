export interface UserType {
  id: string;
  name: string;
  email: string;
  coins: number;
  // userRole: 'storeCustomer' | 'storeAdmin';
  storeId: string;
  // inGameCoins: number;
  // createdAt: Date;
}