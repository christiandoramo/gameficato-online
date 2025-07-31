// frontend/src/lib/api/auth.ts
import { connectionAPIGet } from "./connectionAPI";
import { getItemStorage, removeItemStorage, setItemStorage } from "@/lib/store";
import { apiCore, URL_USER } from "./base-urls";
import type { UserType } from "../types/user-type";
import { redirect } from "react-router-dom";

export interface LoginApiResponse {
  data: {
    access_token: string;
    userId: string;
  };
  error: Error | null;
  success: boolean;
}

export interface UserApiResponse {
  data: {
    user: UserType;
  };
  error: Error | null;
  success: boolean;
}

export const AUTHORIZATION_KEY = "AUTHORIZATION_KEY";
export const USER_ID_KEY = "USER_ID_KEY";

export const unsetAuthorizationToken = () =>
  removeItemStorage(AUTHORIZATION_KEY);

export const getAuthorizationToken = () => getItemStorage(AUTHORIZATION_KEY);

export const getUserId = () => getItemStorage(USER_ID_KEY);

export const setUserId = (userId?: string) => {
  if (userId) {
    setItemStorage(USER_ID_KEY, userId);
  }
};

export const setAuthrizationToken = (token?: string) => {
  if (token) {
    setItemStorage(AUTHORIZATION_KEY, token);
    apiCore.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export async function verifyLoggedIn(): Promise<UserType | null> {
  const token = getAuthorizationToken();
  const userId = getUserId();
  if (!token || !userId) {
    // força login
    throw redirect("/login");
  }

  try {
    const res = await connectionAPIGet<UserApiResponse>(
      `${URL_USER}/${userId}`
    );
    if (!!res?.data) {
      setAuthrizationToken(token);
      setUserId(userId);
      return res?.data?.user;
    }
  } catch {
    unsetAuthorizationToken();
    throw redirect("/login");
  }
  return null;
}
