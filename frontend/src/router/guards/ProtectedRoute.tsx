import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Forbidden403 } from './Forbidden403';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
  moduleName?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  moduleName,
}) => {
  const { currentUser, currentRole } = useAuth();
  const location = useLocation();

  // Tầng 1: Kiểm tra đăng nhập (Authentication)
  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Tầng 2: Kiểm tra quyền hạn theo vai trò (RBAC Authorization)
  if (allowedRoles && allowedRoles.length > 0) {
    if (!currentRole || !allowedRoles.includes(currentRole)) {
      return <Forbidden403 requiredRoles={allowedRoles} moduleName={moduleName} />;
    }
  }

  return children;
};

export default ProtectedRoute;
