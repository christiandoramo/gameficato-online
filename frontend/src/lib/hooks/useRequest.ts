// frontend/src/lib/hooks/useRequest.ts
import { useState } from "react";
import { homeRoutesEnum } from "@/pages/routes";
import type { AuthType } from "@/lib/types/auth-type";
import { ERROR_INVALID_PASSWORD } from "@/lib/utils/error-status";
import { URL_AUTH } from "@/lib/api/base-urls";
import { setAuthrizationToken } from "@/lib/api/auth";
import ConnectionAPI, {
  connectionAPIPost,
  type MethodType,
} from "@/lib/api/connectionAPI";
import { useGlobalContext } from "../contexts/globalContext";

export const useRequest = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setNotification, setUser } = useGlobalContext();

  const authRequest = async (
    body: unknown,
    navigate: (path: string) => void
  ): Promise<void> => {
    setLoading(true);

    await connectionAPIPost<AuthType>(URL_AUTH, body)
      .then((res) => {
        setUser(res.user);
        setAuthrizationToken(res?.accessToken);
        navigate(homeRoutesEnum.HOME);
        return res;
      })
      .catch(() => {
        setNotification(ERROR_INVALID_PASSWORD, "error");
        return undefined;
      });

    setLoading(false);
  };

  const request = async <T>(
    url: string,
    method: MethodType,
    saveGlobal?: (object: T) => void,
    body?: unknown
  ): Promise<T | undefined> => {
    setLoading(true);
    const returnObject: T | undefined = await ConnectionAPI.connect<T>(
      url,
      method,
      body
    )
      .then((result) => {
        if (saveGlobal) {
          saveGlobal(result);
        }
        return result;
      })
      .catch((error: Error) => {
        setNotification(error.message, "error");
        return undefined;
      });

    setLoading(false);
    return returnObject;
  };

  return {
    loading,
    request,
    authRequest,
  };
};
