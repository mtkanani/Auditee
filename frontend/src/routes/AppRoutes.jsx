import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Protected Route Guard
import { ProtectedRoute } from './ProtectedRoute';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { VerifyOTP } from '../pages/auth/VerifyOTP';

// Super Admin Pages
import { SuperAdminDashboard } from '../pages/super-admin/SuperAdminDashboard';
import { FirmManagement } from '../pages/super-admin/FirmManagement';

// Firm Admin Pages
import { FirmAdminDashboard } from '../pages/firm-admin/FirmAdminDashboard';
import { UserManagement } from '../pages/firm-admin/UserManagement';
import { ClientManagement } from '../pages/firm-admin/ClientManagement';
import { ClientAssignments } from '../pages/firm-admin/ClientAssignments';
import { FirmAnnouncements } from '../pages/firm-admin/FirmAnnouncements';
import { Compliance } from '../pages/firm-admin/Compliance';
import { Reports } from '../pages/firm-admin/Reports';

// User / Employee Pages
import { UserDashboard } from '../pages/user/UserDashboard';
import { UserAnnouncements } from '../pages/user/UserAnnouncements';
import { MyTasks } from '../pages/user/MyTasks';
import { MyClients } from '../pages/user/MyClients';
import { TimeEntries } from '../pages/user/TimeEntries';
import { UserProfile } from '../pages/user/UserProfile';

// Client Pages
import { ClientDashboard } from '../pages/client/ClientDashboard';
import { WorkRequests } from '../pages/client/WorkRequests';
import { ClientTasks } from '../pages/client/ClientTasks';
import { ClientProfile } from '../pages/client/ClientProfile';

export const AppRoutes = () => {
  const { isAuthenticated, user, getRoleDashboardPath } = useAuth();

  return (
    <Routes>
      {/* Root Route: Redirects based on Auth & Role */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={getRoleDashboardPath(user?.role)} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
      </Route>

      {/* Protected Routes (Dashboard Layout) */}
      <Route element={<DashboardLayout />}>
        {/* SUPER ADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/firms" element={<FirmManagement />} />
        </Route>

        {/* FIRM ADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['FIRM_ADMIN', 'ADMIN']} />}>
          <Route path="/firm-admin/dashboard" element={<FirmAdminDashboard />} />
          <Route path="/firm-admin/users" element={<UserManagement />} />
          <Route path="/firm-admin/clients" element={<ClientManagement />} />
          <Route path="/firm-admin/assignments" element={<ClientAssignments />} />
          <Route path="/firm-admin/announcements" element={<FirmAnnouncements />} />
          <Route path="/firm-admin/compliance" element={<Compliance />} />
          <Route path="/firm-admin/reports" element={<Reports />} />
        </Route>

        {/* EMPLOYEE USER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['USER', 'EMPLOYEE']} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/announcements" element={<UserAnnouncements />} />
          <Route path="/user/tasks" element={<MyTasks />} />
          <Route path="/user/clients" element={<MyClients />} />
          <Route path="/user/time-entries" element={<TimeEntries />} />
          <Route path="/user/profile" element={<UserProfile />} />
        </Route>

        {/* CLIENT ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/work-requests" element={<WorkRequests />} />
          <Route path="/client/tasks" element={<ClientTasks />} />
          <Route path="/client/profile" element={<ClientProfile />} />
        </Route>
      </Route>

      {/* 404 Catch-All */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-6xl font-extrabold text-indigo-500 mb-2">404</h1>
            <p className="text-xl font-bold text-slate-100">Page Not Found</p>
            <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6">
              The page you are looking for does not exist or has been moved.
            </p>
            <Link
              to="/"
              className="py-2.5 px-6 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-lg"
            >
              Return Home
            </Link>
          </div>
        }
      />
    </Routes>
  );
};
