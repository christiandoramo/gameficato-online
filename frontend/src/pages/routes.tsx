// src/pages/routes.tsx
import type { RouteObject } from 'react-router-dom';

import Login from './login';
import Home from './home';
import Gameplay from './gameplay';

export const loginRoutesEnum = {
  LOGIN: '/'
};

export const homeRoutesEnum = {
  HOME: '/home',
};

export const gameplayRoutesEnum = {
  GAMEPLAY: '/gameplay'
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
    element: <Home />,
  },
];


export const gameplayRoutes: RouteObject[] = [
  {
    path: gameplayRoutesEnum.GAMEPLAY,
    element: <Gameplay/>,
  },
];