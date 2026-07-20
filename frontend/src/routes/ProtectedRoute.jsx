import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';
import { normalizeRole } from '../utils/helpers';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, user, getRoleDashboardPath } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size="lg" message="Verifying session authorization..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0) {
    const userRoleNormalized = normalizeRole(user?.role);
    const normalizedAllowedRoles = allowedRoles.map((r) => normalizeRole(r));

    if (!normalizedAllowedRoles.includes(userRoleNormalized)) {
      const authorizedPath = getRoleDashboardPath(user?.role);
      return <Navigate to={authorizedPath} replace />;
    }
  }

  return <Outlet />;
};
