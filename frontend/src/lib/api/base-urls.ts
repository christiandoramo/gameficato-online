import axios from 'axios';

// backend microsserviços com nestJS
export const apiCore = axios.create({ baseURL: import.meta.env.VITE_CORE_API_URL });

// backend de processamento dos jogos em GO
export const apiGameplay = axios.create({ baseURL: import.meta.env.VITE_GAMEPLAY_API_URL });

export const URL_USER = `${apiCore.defaults.baseURL}users`;
export const URL_AUTH = `${apiCore.defaults.baseURL}auth`;
export const URL_COUPONS = `${apiCore.defaults.baseURL}coupons`;
export const URL_REWARDS = `${apiCore.defaults.baseURL}rewards`;
export const URL_COUPONS_SHOPS = `${apiCore.defaults.baseURL}coupons-shops`;
export const URL_GAMES = `${apiCore.defaults.baseURL}games`;
export const URL_STORES = `${apiCore.defaults.baseURL}stores`;

export const URL_GAMEPLAY = `${apiGameplay.defaults.baseURL}`;
