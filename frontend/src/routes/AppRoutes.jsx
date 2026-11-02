import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts (loaded eagerly)
import { AuthLayout } from '../layouts/AuthLayout';

// Protected Route Guard
import { ProtectedRoute } from './ProtectedRoute';

// Auth Pages (eager login, lazy secondary)
import { Login } from '../pages/auth/Login';
import {
  DashboardLayout,
  Register,
  ForgotPassword,
  ResetPassword,
  VerifyOTP,
  UiKit,
  SuperAdminDashboard,
  MeetingsManagement,
  FirmManagement,
  FirmAdminDashboard,
  BillingManagement,
  LeadManagement,
  UserManagement,
  ClientManagement,
  ClientAssignments,
  FirmTaskManagement,
  FirmAnnouncements,
  Compliance,
  AttendanceManagement,
  LeaveManagement,
  DocumentVault,
  Reports,
  UserDashboard,
  UserAnnouncements,
  MyTasks,
  MyClients,
  TimeEntries,
  UserProfile,
  DeleteAccount,
  CalendarPage,
  ClientDashboard,
  ClientBilling,
  WorkRequests,
  ClientTasks,
  ClientProfile,
  HOME_PAGES,
} from './pages';

// Shown while a page's code downloads: the Auditee mark with an orbiting arc and a sliding bar.
const RouteLoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 p-6" role="status" aria-label="Loading">
    <div className="relative w-16 h-16" aria-hidden="true">
      <span className="spin-slow absolute inset-0 rounded-full border-2 border-transparent border-t-accent border-r-accent/40" />
      <span className="absolute inset-2 grid place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-on-accent text-xl font-semibold shadow-glow">
        A
      </span>
    </div>
    <div className="w-40 h-1 rounded-full bg-hover overflow-hidden" aria-hidden="true">
      <span className="indeterminate block h-full w-1/3 rounded-full bg-accent" />
    </div>
    <span className="text-xs font-medium text-muted">Loading…</span>
  </div>
);

export const AppRoutes = () => {
  const { isAuthenticated, user, getRoleDashboardPath } = useAuth();

  useEffect(() => {
    // While the login page is idle, fetch the app shell and the four home pages (small) so the
    // first screen after sign-in needs no download.
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    idle(() => [DashboardLayout, ...HOME_PAGES].forEach((page) => page.preload()));
  }, []);

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
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

        {UiKit && <Route path="/ui-kit" element={<UiKit />} />}

        {/* Public Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
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
            <Route path="/firm-admin/billing" element={<BillingManagement />} />
            <Route path="/firm-admin/leads" element={<LeadManagement />} />
            <Route path="/firm-admin/tasks" element={<FirmTaskManagement />} />
            <Route path="/firm-admin/users" element={<UserManagement />} />
            <Route path="/firm-admin/clients" element={<ClientManagement />} />
            <Route path="/firm-admin/assignments" element={<ClientAssignments />} />
            <Route path="/firm-admin/announcements" element={<FirmAnnouncements />} />
            <Route path="/firm-admin/compliance" element={<Compliance />} />
            <Route path="/firm-admin/attendance" element={<AttendanceManagement />} />
            <Route path="/firm-admin/leave-management" element={<LeaveManagement />} />
            <Route path="/firm-admin/document-vault" element={<DocumentVault />} />
            <Route path="/firm-admin/meetings" element={<MeetingsManagement />} />
            <Route path="/firm-admin/reports" element={<Reports />} />
          </Route>

          {/* EMPLOYEE USER ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={['USER', 'EMPLOYEE']} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/announcements" element={<UserAnnouncements />} />
            <Route path="/user/tasks" element={<MyTasks />} />
            <Route path="/user/attendance" element={<AttendanceManagement />} />
            <Route path="/user/leaves" element={<LeaveManagement />} />
            <Route path="/user/clients" element={<MyClients />} />
            <Route path="/user/time-entries" element={<TimeEntries />} />
            <Route path="/user/document-vault" element={<DocumentVault />} />
            <Route path="/user/meetings" element={<MeetingsManagement />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/delete-account" element={<DeleteAccount />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>

          {/* CLIENT ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/billing" element={<ClientBilling />} />
            <Route path="/client/work-requests" element={<WorkRequests />} />
            <Route path="/client/tasks" element={<ClientTasks />} />
            <Route path="/client/document-vault" element={<DocumentVault />} />
            <Route path="/client/meetings" element={<MeetingsManagement />} />
            <Route path="/client/profile" element={<ClientProfile />} />
            <Route path="/client/delete-account" element={<DeleteAccount />} />
          </Route>
        </Route>

        {/* 404 Catch-All */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-page flex flex-col items-center justify-center p-6 text-center">
              <h1 className="text-6xl font-semibold text-accent-fg mb-2 tabular-nums">404</h1>
              <p className="text-xl font-semibold text-fg">Page not found</p>
              <p className="text-sm text-muted max-w-sm mt-1 mb-6">
                The page you are looking for does not exist or has been moved.
              </p>
              <Link
                to="/"
                className="inline-flex items-center h-10 px-5 rounded-xl bg-accent text-on-accent text-sm font-medium hover:bg-accent-hover transition-colors"
              >
                Go home
              </Link>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
};
