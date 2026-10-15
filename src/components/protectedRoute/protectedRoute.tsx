import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '@services/store.ts';

import type React from 'react';

type ProtectedRouteProps = {
  onlyUnauth?: boolean;
  component: React.JSX.Element;
};

export const ProtectedRoute = ({
  onlyUnauth = false,
  component,
}: ProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();

  const { user, isAuthChecked } = useSelector((state) => state.user);

  if (!isAuthChecked) {
    return <div>Загрузка...</div>;
  }

  if (onlyUnauth && user) {
    const from = (location.state as { from?: { pathname: string } })?.from ?? {
      pathname: '/',
    };

    return <Navigate to={from} replace />;
  }

  if (!onlyUnauth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return component;
};
