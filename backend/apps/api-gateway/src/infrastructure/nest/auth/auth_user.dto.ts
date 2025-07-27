import type { User } from '@gameficato/customers/domain/entities/user.entity';

export type AuthUser = Pick<User, 'id' | 'name' | 'email' | 'password'>;
