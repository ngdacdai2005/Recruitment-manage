import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { appConfig } from '../../config/app.config';

interface RoleGuardProps {
  children: React.ReactElement;
  allowedRoles: UserRole[];
  redirectPath?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  redirectPath = appConfig.routes.public.home,
}) => {
  const { currentRole } = useAuth();
  const location = useLocation();

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    if (currentRole === 'ROLE_CANDIDATE') {
      return <Navigate to={appConfig.routes.candidate.dashboard} replace />;
    }
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

export default RoleGuard;
