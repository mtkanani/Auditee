import { lazyPage } from '../lib/loadProgress';

// The app shell (sidebar, top bar, command palette) is only needed after sign-in, so it stays out of
// the login bundle; it is preloaded in the background once the first screen is idle.
export const loadDashboardLayout = () => import('../layouts/DashboardLayout');
export const DashboardLayout = lazyPage(loadDashboardLayout, 'DashboardLayout');
export const Register = lazyPage(() => import('../pages/Register'));
export const ForgotPassword = lazyPage(() => import('../pages/auth/ForgotPassword'));
export const ResetPassword = lazyPage(() => import('../pages/auth/ResetPassword'), 'ResetPassword');
export const VerifyOTP = lazyPage(() => import('../pages/auth/VerifyOTP'), 'VerifyOTP');

// UI kit showcase: development only, removed from production builds.
export const UiKit = import.meta.env.DEV ? lazyPage(() => import('../pages/dev/UiKit')) : null;

// Lazy-loaded Super Admin Pages
export const SuperAdminDashboard = lazyPage(() => import('../pages/super-admin/SuperAdminDashboard'), 'SuperAdminDashboard');
export const MeetingsManagement = lazyPage(() => import('../pages/meetings/MeetingsManagement'), 'MeetingsManagement');
export const FirmManagement = lazyPage(() => import('../pages/super-admin/FirmManagement'), 'FirmManagement');

// Lazy-loaded Firm Admin Pages (Heavy charts, tables, & libraries code-split on demand)
export const FirmAdminDashboard = lazyPage(() => import('../pages/firm-admin/FirmAdminDashboard'), 'FirmAdminDashboard');
export const BillingManagement = lazyPage(() => import('../pages/firm-admin/BillingManagement'), 'BillingManagement');
export const LeadManagement = lazyPage(() => import('../pages/firm-admin/LeadManagement'), 'LeadManagement');
export const UserManagement = lazyPage(() => import('../pages/firm-admin/UserManagement'), 'UserManagement');
export const ClientManagement = lazyPage(() => import('../pages/firm-admin/ClientManagement'), 'ClientManagement');
export const ClientAssignments = lazyPage(() => import('../pages/firm-admin/ClientAssignments'), 'ClientAssignments');
export const FirmTaskManagement = lazyPage(() => import('../pages/firm-admin/FirmTaskManagement'), 'FirmTaskManagement');
export const FirmAnnouncements = lazyPage(() => import('../pages/firm-admin/FirmAnnouncements'), 'FirmAnnouncements');
export const Compliance = lazyPage(() => import('../pages/firm-admin/Compliance'), 'Compliance');
export const AttendanceManagement = lazyPage(() => import('../pages/firm-admin/AttendanceManagement'), 'AttendanceManagement');
export const LeaveManagement = lazyPage(() => import('../pages/firm-admin/LeaveManagement'), 'LeaveManagement');
export const DocumentVault = lazyPage(() => import('../pages/firm-admin/DocumentVault'), 'DocumentVault');
export const Reports = lazyPage(() => import('../pages/firm-admin/Reports'), 'Reports');

// Lazy-loaded Employee User Pages
export const UserDashboard = lazyPage(() => import('../pages/user/UserDashboard'), 'UserDashboard');
export const UserAnnouncements = lazyPage(() => import('../pages/user/UserAnnouncements'), 'UserAnnouncements');
export const MyTasks = lazyPage(() => import('../pages/user/MyTasks'), 'MyTasks');
export const MyClients = lazyPage(() => import('../pages/user/MyClients'), 'MyClients');
export const TimeEntries = lazyPage(() => import('../pages/user/TimeEntries'), 'TimeEntries');
export const UserProfile = lazyPage(() => import('../pages/user/UserProfile'), 'UserProfile');
export const DeleteAccount = lazyPage(() => import('../pages/DeleteAccount'));
export const CalendarPage = lazyPage(() => import('../pages/user/Calendar'));

// Lazy-loaded Client Pages
export const ClientDashboard = lazyPage(() => import('../pages/client/ClientDashboard'), 'ClientDashboard');
export const ClientBilling = lazyPage(() => import('../pages/client/ClientBilling'), 'ClientBilling');
export const WorkRequests = lazyPage(() => import('../pages/client/WorkRequests'), 'WorkRequests');
export const ClientTasks = lazyPage(() => import('../pages/client/ClientTasks'), 'ClientTasks');
export const ClientProfile = lazyPage(() => import('../pages/client/ClientProfile'), 'ClientProfile');


// Page for each app path, so links can start downloading a page before it is opened.
const PAGES_BY_PATH = {
  '/ui-kit': UiKit,
  '/register': Register,
  '/forgot-password': ForgotPassword,
  '/reset-password': ResetPassword,
  '/verify-otp': VerifyOTP,
  '/super-admin/dashboard': SuperAdminDashboard,
  '/super-admin/firms': FirmManagement,
  '/firm-admin/dashboard': FirmAdminDashboard,
  '/firm-admin/billing': BillingManagement,
  '/firm-admin/leads': LeadManagement,
  '/firm-admin/tasks': FirmTaskManagement,
  '/firm-admin/users': UserManagement,
  '/firm-admin/clients': ClientManagement,
  '/firm-admin/assignments': ClientAssignments,
  '/firm-admin/announcements': FirmAnnouncements,
  '/firm-admin/compliance': Compliance,
  '/firm-admin/attendance': AttendanceManagement,
  '/firm-admin/leave-management': LeaveManagement,
  '/firm-admin/document-vault': DocumentVault,
  '/firm-admin/meetings': MeetingsManagement,
  '/firm-admin/reports': Reports,
  '/user/dashboard': UserDashboard,
  '/user/announcements': UserAnnouncements,
  '/user/tasks': MyTasks,
  '/user/attendance': AttendanceManagement,
  '/user/leaves': LeaveManagement,
  '/user/clients': MyClients,
  '/user/time-entries': TimeEntries,
  '/user/document-vault': DocumentVault,
  '/user/meetings': MeetingsManagement,
  '/user/profile': UserProfile,
  '/user/delete-account': DeleteAccount,
  '/calendar': CalendarPage,
  '/client/dashboard': ClientDashboard,
  '/client/billing': ClientBilling,
  '/client/work-requests': WorkRequests,
  '/client/tasks': ClientTasks,
  '/client/document-vault': DocumentVault,
  '/client/meetings': MeetingsManagement,
  '/client/profile': ClientProfile,
  '/client/delete-account': DeleteAccount,
};

/** Starts downloading a page's code (no-op for unknown paths). Safe to call many times. */
export const preloadRoute = (path) => PAGES_BY_PATH[path]?.preload?.();

/** The home page for each role: preloaded during sign-in so the first screen appears straight away. */
export const HOME_PAGES = [FirmAdminDashboard, UserDashboard, ClientDashboard, SuperAdminDashboard];
