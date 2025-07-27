import { connectionAPIGet } from './connectionAPI';
import { getItemStorage, removeItemStorage, setItemStorage } from './../store';
import { URL_USER } from './base-urls';
import type { UserType } from '../types/user-type';


export const AUTHORIZATION_KEY = 'AUTHORIZATION_KEY'
export const unsetAuthorizationToken = () => removeItemStorage(AUTHORIZATION_KEY);

export const setAuthrizationToken = (token?: string) => {
  if (token) {
    setItemStorage(AUTHORIZATION_KEY, token);
  }
};

export const getAuthorizationToken = () => getItemStorage(AUTHORIZATION_KEY);

export const verifyLoggedIn = async () => {
  const token = getAuthorizationToken();
  if (!token) {
    location.href = '/login';
  }
  await connectionAPIGet<UserType>(URL_USER).catch(() => {
    unsetAuthorizationToken();
    location.href = '/login';
  });

  return null;
};