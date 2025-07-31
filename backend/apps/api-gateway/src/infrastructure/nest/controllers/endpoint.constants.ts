// apps/api-gateway/src/infrastructure/nest/controllers/endpoint.constants.ts
export const HTTP_ENDPOINTS = {
  AUTH: {
    CHANGE_PASSWORD: 'auth/password',
    LOGIN: 'auth/signin',
  },
  USER: {
    CREATE: 'users',
    UPDATE: 'users/:id',
    GET_BY_ID: 'users/:id',
    GET_ALL: 'users',
  },
  REWARD: {
    CREATE: 'rewards',
    GET_ALL: 'rewards',
  },
  STORE: {
    GET_ALL: 'stores',
  },
};
