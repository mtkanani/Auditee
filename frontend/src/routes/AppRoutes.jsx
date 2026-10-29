import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts (loaded eagerly)
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Protected Route Guard
import { ProtectedRoute } from './ProtectedRoute';

// Auth Pages (eager login, lazy secondary)
import { Login } from '../pages/auth/Login';
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword').then((m) => ({ default: m.ResetPassword })));
const VerifyOTP = lazy(() => import('../pages/auth/VerifyOTP').then((m) => ({ default: m.VerifyOTP })));

// UI kit showcase: development only, removed from production builds.
const UiKit = import.meta.env.DEV ? lazy(() => import('../pages/dev/UiKit')) : null;

// Lazy-loaded Super Admin Pages
const SuperAdminDashboard = lazy(() => import('../pages/super-admin/SuperAdminDashboard').then((m) => ({ default: m.SuperAdminDashboard })));
const MeetingsManagement = lazy(() => import('../pages/meetings/MeetingsManagement').then((m) => ({ default: m.MeetingsManagement })));
const FirmManagement = lazy(() => import('../pages/super-admin/FirmManagement').then((m) => ({ default: m.FirmManagement })));

// Lazy-loaded Firm Admin Pages (Heavy charts, tables, & libraries code-split on demand)
const FirmAdminDashboard = lazy(() => import('../pages/firm-admin/FirmAdminDashboard').then((m) => ({ default: m.FirmAdminDashboard })));
const BillingManagement = lazy(() => import('../pages/firm-admin/BillingManagement').then((m) => ({ default: m.BillingManagement })));
const LeadManagement = lazy(() => import('../pages/firm-admin/LeadManagement').then((m) => ({ default: m.LeadManagement })));
const UserManagement = lazy(() => import('../pages/firm-admin/UserManagement').then((m) => ({ default: m.UserManagement })));
const ClientManagement = lazy(() => import('../pages/firm-admin/ClientManagement').then((m) => ({ default: m.ClientManagement })));
const ClientAssignments = lazy(() => import('../pages/firm-admin/ClientAssignments').then((m) => ({ default: m.ClientAssignments })));
const FirmTaskManagement = lazy(() => import('../pages/firm-admin/FirmTaskManagement').then((m) => ({ default: m.FirmTaskManagement })));
const FirmAnnouncements = lazy(() => import('../pages/firm-admin/FirmAnnouncements').then((m) => ({ default: m.FirmAnnouncements })));
const Compliance = lazy(() => import('../pages/firm-admin/Compliance').then((m) => ({ default: m.Compliance })));
const AttendanceManagement = lazy(() => import('../pages/firm-admin/AttendanceManagement').then((m) => ({ default: m.AttendanceManagement })));
const LeaveManagement = lazy(() => import('../pages/firm-admin/LeaveManagement').then((m) => ({ default: m.LeaveManagement })));
const DocumentVault = lazy(() => import('../pages/firm-admin/DocumentVault').then((m) => ({ default: m.DocumentVault })));
const Reports = lazy(() => import('../pages/firm-admin/Reports').then((m) => ({ default: m.Reports })));

// Lazy-loaded Employee User Pages
const UserDashboard = lazy(() => import('../pages/user/UserDashboard').then((m) => ({ default: m.UserDashboard })));
const UserAnnouncements = lazy(() => import('../pages/user/UserAnnouncements').then((m) => ({ default: m.UserAnnouncements })));
const MyTasks = lazy(() => import('../pages/user/MyTasks').then((m) => ({ default: m.MyTasks })));
const MyClients = lazy(() => import('../pages/user/MyClients').then((m) => ({ default: m.MyClients })));
const TimeEntries = lazy(() => import('../pages/user/TimeEntries').then((m) => ({ default: m.TimeEntries })));
const UserProfile = lazy(() => import('../pages/user/UserProfile').then((m) => ({ default: m.UserProfile })));
const DeleteAccount = lazy(() => import('../pages/DeleteAccount'));
const CalendarPage = lazy(() => import('../pages/user/Calendar'));

// Lazy-loaded Client Pages
const ClientDashboard = lazy(() => import('../pages/client/ClientDashboard').then((m) => ({ default: m.ClientDashboard })));
const ClientBilling = lazy(() => import('../pages/client/ClientBilling').then((m) => ({ default: m.ClientBilling })));
const WorkRequests = lazy(() => import('../pages/client/WorkRequests').then((m) => ({ default: m.WorkRequests })));
const ClientTasks = lazy(() => import('../pages/client/ClientTasks').then((m) => ({ default: m.ClientTasks })));
const ClientProfile = lazy(() => import('../pages/client/ClientProfile').then((m) => ({ default: m.ClientProfile })));

// Sleek Loading Fallback for Suspense
const RouteLoadingFallback = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 space-y-3">
    <div className="w-9 h-9 border-3 border-accent/20 border-t-accent rounded-full animate-spin" aria-hidden="true" />
    <span className="text-xs font-medium text-muted" role="status">Loading…</span>
  </div>
);

export const AppRoutes = () => {
  const { isAuthenticated, user, getRoleDashboardPath } = useAuth();

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
