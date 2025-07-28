// apps/api-gateway/src/infrastructure/nest/auth/auth_user.dto.ts
import type { User } from '@gameficato/customers/domain/entities/user.entity';

export type AuthUser = Pick<User, 'id' | 'name' | 'email' | 'password'>;
