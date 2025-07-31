// frontend/src/pages/routes.tsx
import type { RouteObject } from "react-router-dom";

import Login from "./login";
import Home from "./home";
import Gameplay from "./gameplay";
// import Layout from "@/components/layout";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";

export const loginRoutesEnum = {
  LOGIN: "/login",
};

export const homeRoutesEnum = {
  HOME: "/",
};

export const gameplayRoutesEnum = {
  GAMEPLAY: "gameplay",
};

export const loginRoutes: RouteObject[] = [
  {
    path: loginRoutesEnum.LOGIN,
    element: <Login />,
  },
];

// export const homeRoutes: RouteObject[] = [
//   {
//     path: homeRoutesEnum.HOME,
//     element: <AuthenticatedLayout />,
//     children: [
//       {
//         path: "",
//         element: <Home />,
//       },
//       { path: gameplayRoutesEnum.GAMEPLAY, element: <Gameplay /> },
//     ],
//   },
// ];

export const homeRoutes: RouteObject[] = [
  {
    path: homeRoutesEnum.HOME,
    element: <AuthenticatedLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: gameplayRoutesEnum.GAMEPLAY+"/:gameId", element: <Gameplay /> },
    ],
  },
];
