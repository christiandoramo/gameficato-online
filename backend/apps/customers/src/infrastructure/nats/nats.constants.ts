// apps/customers/src/infrastructure/nats/nats.constants.ts

export const NATS_SERVICES = {
  USER: {
    GET_BY_EMAIL: 'CUSTOMERS.user.getByEmail',
    UPDATE: 'CUSTOMERS.user.update',
    CREATE: 'CUSTOMERS.user.create',
    CHANGE_PASSWORD: 'CUSTOMERS.user.changePassword',
    GET_BY_ID: 'CUSTOMERS.user.getById',
    GET_ALL: 'CUSTOMERS.user.getAll',
  },
  REWARD: {
    CREATE: 'CUSTOMERS.reward.create',
  },
  STORE: {
    GET_ALL: 'CUSTOMERS.stores.getAll',
  },
};

export const NATS_EVENTS = {
  USER: {
    UPDATED: 'CUSTOMERS.user.event.updated',
    CREATED: 'CUSTOMERS.user.event.created',
    UPDATED_PASSWORD: 'CUSTOMERS.user.event.updatedPassword',
  },
  REWARD: {
    CREATED: 'CUSTOMERS.reward.event.created',
  },
};
