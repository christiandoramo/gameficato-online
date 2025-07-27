import { useEffect } from 'react';
import { createBrowserRouter, type RouteObject, RouterProvider } from 'react-router-dom';

import { homeRoutes,loginRoutes } from './pages/routes';
import { URL_USER } from './lib/api/base-urls';
import { MethodsEnum } from './lib/utils/http-methods.enum';
import { verifyLoggedIn } from './lib/api/auth';
import { useGlobalContext } from './lib/contexts/globalContext';
import { useNotification } from './lib/contexts/notificationContext';
import { useRequest } from './lib/hooks/useRequest';

const routes: RouteObject[] = [...loginRoutes];
const routesLoggedIn: RouteObject[] = [...homeRoutes].map((route) => ({
  ...route,
  loader: verifyLoggedIn,
}));

const router = createBrowserRouter([...routes, ...routesLoggedIn]);//, ...registerRoutes]);

function App() {
  const { contextHolder } = useNotification();
  const { setUser } = useGlobalContext();
  const { request } = useRequest();

  useEffect(() => {
    request(URL_USER, MethodsEnum.GET, setUser);
  }, []);

  return (
    <>
      {contextHolder}
      <RouterProvider router={router} />
    </>
  );
}

export default App;