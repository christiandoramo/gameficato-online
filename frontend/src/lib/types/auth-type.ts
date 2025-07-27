import type { UserType } from './user-type';

export interface AuthType {
  accessToken: string;
  user: UserType;
}