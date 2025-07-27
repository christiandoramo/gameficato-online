import axios from 'axios';

// backend microsserviços com nestJS
const apiCore = axios.create({ baseURL: import.meta.env.VITE_CORE_API_URL });

// backend de processamento dos jogos em GO
const apiGameplay = axios.create({ baseURL: import.meta.env.VITE_GAMEPLAY_API_URL });

export const URL_USER = `${apiCore}users`;

export const URL_AUTH = `${apiCore}auth`;

export const URL_COUPONS = `${apiCore}coupons`;

export const URL_REWARDS = `${apiCore}rewards`;

export const URL_COUPONS_SHOPS = `${apiCore}coupons-shops`;

export const URL_GAMES = `${apiCore}games`;

export const URL_GAMEPLAY = `${apiGameplay}`;

