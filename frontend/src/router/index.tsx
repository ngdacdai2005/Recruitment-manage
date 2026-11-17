import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { publicRoutes } from './public.routes';
import { candidateRoutes } from './candidate.routes';
import { adminRoutes } from './admin.routes';

export const AppRoutes: React.FC = () => {
  const routes = useRoutes([
    ...publicRoutes,
    ...candidateRoutes,
    ...adminRoutes,
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);

  return routes;
};

export default AppRoutes;
