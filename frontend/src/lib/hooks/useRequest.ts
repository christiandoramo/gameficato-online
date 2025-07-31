// frontend/src/lib/hooks/useRequest.ts
import { useState } from "react";
import { homeRoutesEnum } from "@/pages/routes";
import { ERROR_INVALID_PASSWORD } from "@/lib/utils/error-status";
import { URL_AUTH,  } from "@/lib/api/base-urls";
import { setAuthrizationToken, setUserId, type LoginApiResponse } from "@/lib/api/auth";
import ConnectionAPI, {
  connectionAPIPost,
  type MethodType,
} from "@/lib/api/connectionAPI";
import { useGlobalContext } from "../contexts/globalContext";



export const useRequest = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setNotification } = useGlobalContext();

  const authRequest = async (
    body: unknown,
    navigate: (path: string) => void
  ): Promise<void> => {
    setLoading(true);

    try {
      // 1) faz o login e guarda token + userId
      const res = await connectionAPIPost<LoginApiResponse>(
        `${URL_AUTH}/signin`,
        body
      );
      setAuthrizationToken(res.data.access_token);
      setUserId(res.data.userId);

      navigate(homeRoutesEnum.HOME);
    } catch (err: any) {
      setNotification(ERROR_INVALID_PASSWORD, "error");
    } finally {
      setLoading(false);
    }
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
        console.log("result:", result);

        return result;
      })
      .catch((error: Error) => {
        console.log("error:", error);

        setNotification(error.message, "error");
        return undefined;
      });

    setLoading(false);
    console.log("returnObject:", returnObject);
    return returnObject;
  };

  return {
    loading,
    request,
    authRequest,
  };
};
