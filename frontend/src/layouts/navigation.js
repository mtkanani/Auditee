import {
  Briefcase, Building2, CalendarDays, ChartColumn, Clock, FolderOpen, Inbox, LayoutDashboard, Megaphone,
  Receipt, ShieldCheck, SquareCheckBig, Timer, TrendingUp, User, UserCheck, Users, Video,
} from 'lucide-react';
import { normalizeRole } from '../utils/helpers';

/**
 * Sidebar sections per role. Each item: { path, label, icon }.
 * The sidebar and the Ctrl K palette both read from here.
 */
const NAV = {
  SUPER_ADMIN: [
    {
      label: 'Platform',
      items: [
        { path: '/super-admin/dashboard', label: 'Overview', icon: LayoutDashboard },
        { path: '/super-admin/firms', label: 'Firms', icon: Building2 },
      ],
    },
  ],
  FIRM_ADMIN: [
    {
      label: 'Workspace',
      items: [
        { path: '/firm-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/firm-admin/tasks', label: 'Tasks', icon: SquareCheckBig },
        { path: '/firm-admin/compliance', label: 'Compliance', icon: ShieldCheck },
        { path: '/firm-admin/meetings', label: 'Meetings', icon: Video },
        { path: '/firm-admin/announcements', label: 'Notices', icon: Megaphone },
      ],
    },
    {
      label: 'Clients',
      items: [
        { path: '/firm-admin/clients', label: 'Clients', icon: Briefcase },
        { path: '/firm-admin/leads', label: 'Leads', icon: TrendingUp },
        { path: '/firm-admin/assignments', label: 'Assignments', icon: UserCheck },
        { path: '/firm-admin/document-vault', label: 'Documents', icon: FolderOpen },
      ],
    },
    {
      label: 'Finance',
      items: [
        { path: '/firm-admin/billing', label: 'Billing', icon: Receipt },
        { path: '/firm-admin/reports', label: 'Reports', icon: ChartColumn },
      ],
    },
    {
      label: 'Team',
      items: [
        { path: '/firm-admin/users', label: 'People', icon: Users },
        { path: '/firm-admin/attendance', label: 'Attendance', icon: Clock },
        { path: '/firm-admin/leave-management', label: 'Leave', icon: CalendarDays },
      ],
    },
  ],
  CLIENT: [
    {
      label: 'Overview',
      items: [{ path: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
      label: 'Work',
      items: [
        { path: '/client/work-requests', label: 'Work requests', icon: Inbox },
        { path: '/client/tasks', label: 'Tasks', icon: SquareCheckBig },
        { path: '/client/meetings', label: 'Meetings', icon: Video },
      ],
    },
    {
      label: 'Account',
      items: [
        { path: '/client/billing', label: 'Billing', icon: Receipt },
        { path: '/client/document-vault', label: 'Documents', icon: FolderOpen },
        { path: '/client/profile', label: 'Profile', icon: User },
      ],
    },
  ],
  USER: [
    {
      label: 'Workspace',
      items: [
        { path: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/user/tasks', label: 'My tasks', icon: SquareCheckBig },
        { path: '/user/meetings', label: 'Meetings', icon: Video },
        { path: '/user/announcements', label: 'Notices', icon: Megaphone },
      ],
    },
    {
      label: 'Clients',
      items: [
        { path: '/user/clients', label: 'My clients', icon: Briefcase },
        { path: '/user/document-vault', label: 'Documents', icon: FolderOpen },
      ],
    },
    {
      label: 'Time',
      items: [
        { path: '/user/attendance', label: 'Attendance', icon: Clock },
        { path: '/user/time-entries', label: 'Time entries', icon: Timer },
        { path: '/user/leaves', label: 'Leave', icon: CalendarDays },
      ],
    },
    {
      label: 'Account',
      items: [{ path: '/user/profile', label: 'Profile', icon: User }],
    },
  ],
};

/**
 * Quick-create actions for the "+ New" menu. They navigate with { openCreate: true } in
 * location state; the target page opens its create form when it sees it.
 */
const CREATE = {
  FIRM_ADMIN: [
    { label: 'Task', path: '/firm-admin/tasks', icon: SquareCheckBig },
    { label: 'Client', path: '/firm-admin/clients', icon: Briefcase },
    { label: 'Invoice', path: '/firm-admin/billing', icon: Receipt },
    { label: 'Lead', path: '/firm-admin/leads', icon: TrendingUp },
  ],
  SUPER_ADMIN: [{ label: 'Firm', path: '/super-admin/firms', icon: Building2 }],
  USER: [{ label: 'Leave request', path: '/user/leaves', icon: CalendarDays, state: { openApplyModal: true } }],
  CLIENT: [],
};

export const getNavGroups = (role) => NAV[normalizeRole(role)] || NAV.USER;
export const getCreateActions = (role) => CREATE[normalizeRole(role)] || [];

/** Profile page for the role, or its dashboard when the role has no profile page. */
export const getProfilePath = (role) => {
  const r = normalizeRole(role);
  if (r === 'CLIENT') return '/client/profile';
  if (r === 'USER') return '/user/profile';
  return getNavGroups(role)[0].items[0].path;
};

