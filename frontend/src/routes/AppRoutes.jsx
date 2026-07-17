import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

// Lazy/direct load pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Profile from '../pages/Profile';
import ChangePassword from '../pages/ChangePassword';
import DeleteAccount from '../pages/DeleteAccount';
import AdminUsers from '../pages/AdminUsers';
import FirmList from '../pages/FirmManagement/FirmList';
import CreateFirm from '../pages/FirmManagement/CreateFirm';
import EditFirm from '../pages/FirmManagement/EditFirm';
import FirmDetails from '../pages/FirmManagement/FirmDetails';

/**
 * Route Guard: Restricted to non-authenticated users only (e.g. login, register).
 * Redirects logged in users to /profile.
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader message="Verifying session..." />;
  }

  return !isAuthenticated ? children : <Navigate to="/profile" replace />;
};

/**
 * Route Guard: Restricted to authenticated users only.
 * Redirects guests/unauthorized users to /login.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader message="Verifying access..." />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/**
 * Route Guard: Restricted to administrator accounts only.
 * Redirects unauthorized users to /profile.
 */
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader message="Verifying admin access..." />;
  }

  return isAuthenticated && (user?.role === 'admin' || user?.role === 'super_admin') ? children : <Navigate to="/profile" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* Protected Pages */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/delete-account"
        element={
          <ProtectedRoute>
            <DeleteAccount />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/firms"
        element={
          <AdminRoute>
            <FirmList />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/firms/create"
        element={
          <AdminRoute>
            <CreateFirm />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/firms/:id"
        element={
          <AdminRoute>
            <FirmDetails />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/firms/:id/edit"
        element={
          <AdminRoute>
            <EditFirm />
          </AdminRoute>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/profile" replace />} />
    </Routes>
  );
};

export default AppRoutes;
