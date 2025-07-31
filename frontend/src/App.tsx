// frontend/src/App.tsx
import { useEffect } from "react";
import {
  createBrowserRouter,
  type RouteObject,
  RouterProvider,
} from "react-router-dom";

import { homeRoutes, loginRoutes } from "./pages/routes";
import {
  getAuthorizationToken,
  getUserId,
  verifyLoggedIn,
  type UserApiResponse,
} from "./lib/api/auth";
import { useNotification } from "./lib/hooks/useNotification";
import { useGlobalContext } from "./lib/contexts/globalContext";
import { useRequest } from "./lib/hooks/useRequest";
import { URL_USER } from "./lib/api/base-urls";
import { MethodsEnum } from "./lib/utils/http-methods.enum";
import ConnectionAPI from "./lib/api/connectionAPI";

const publicRoutes: RouteObject[] = [...loginRoutes];
const protectedRoutes: RouteObject[] = [...homeRoutes].map((route) => ({
  ...route,
  loader: verifyLoggedIn, // mantém seu loader pra rotas protegidas
}));

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

function App() {
  const { contextHolder } = useNotification();
  const { setUser } = useGlobalContext();
  const { request } = useRequest();

  useEffect(() => {
    const getUserNow = async () => {
      const token = getAuthorizationToken();
      const userId = getUserId();
      if (token && userId) {
        await request(`${URL_USER}/${userId}`, MethodsEnum.GET, setUser);
        const perfil = await ConnectionAPI.connect<UserApiResponse>(
          `${URL_USER}/${userId}`,
          MethodsEnum.GET
        );
        setUser(perfil.data);
      }
    };
    getUserNow()
  }, []);

  return (
    <>
      {contextHolder}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
