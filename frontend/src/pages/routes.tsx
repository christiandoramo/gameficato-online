// frontend/src/pages/routes.tsx
import type { RouteObject } from "react-router-dom";

import Login from "./login";
import Home from "./home";
import Gameplay from "./gameplay";
import Layout from "@/components/layout";

export const loginRoutesEnum = {
  LOGIN: "/",
};

export const homeRoutesEnum = {
  HOME: "/home",
};

export const gameplayRoutesEnum = {
  GAMEPLAY: "/gameplay",
};

export const loginRoutes: RouteObject[] = [
  {
    path: loginRoutesEnum.LOGIN,
    element: <Login />,
  },
];

export const homeRoutes: RouteObject[] = [
  {
    path: homeRoutesEnum.HOME,
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      { path: gameplayRoutesEnum.GAMEPLAY, element: <Gameplay /> },
    ],
  },
];