import { firmAdminService } from '../services/firmAdminService';
import { userService } from '../services/userService';
import { clientService } from '../services/clientService';
import { superAdminService } from '../services/superAdminService';
import { dashboardKeys, firmKeys, taskKeys } from './keys';
import { queryClient } from '../lib/queryClient';

// Query definitions for each role's home page. The pages use them, and sign-in uses them to start
// loading the home page's data before that page has even rendered.

export const firmHomeQuery = {
  queryKey: dashboardKeys.firmHome(),
  queryFn: async () => {
    const res = await firmAdminService.getHome();
    return res.data || res;
  },
};

/** Charts on the firm admin home; history changes slowly, so it is kept for 5 minutes. */
export const firmInsightsQuery = {
  queryKey: dashboardKeys.firmInsights(),
  queryFn: async () => {
    const res = await firmAdminService.getHomeInsights();
    return res.data || res;
  },
  staleTime: 5 * 60_000,
};

export const userHomeQuery = {
  queryKey: dashboardKeys.byRole('user'),
  queryFn: () => userService.getDashboard(),
};

export const myTasksQuery = (filters = {}) => ({
  queryKey: taskKeys.list('user', filters),
  queryFn: () => userService.getTasks(filters),
});

export const clientHomeQuery = {
  queryKey: dashboardKeys.byRole('client'),
  queryFn: async () => {
    const [dashRes, myUserRes] = await Promise.all([
      clientService.getDashboard(),
      clientService.getMyUser().catch(() => null),
    ]);
    return {
      dashboard: dashRes.data || dashRes,
      assignedUser: myUserRes?.data || myUserRes?.user || null,
    };
  },
};

export const firmsListQuery = (params) => ({
  queryKey: firmKeys.list(params),
  queryFn: () => superAdminService.getAllFirms(params),
});

/** Starts loading the signed-in role's home data (fire and forget; errors surface on the page). */
export const prefetchHome = (role) => {
  const r = String(role || '').toUpperCase();
  const queries =
    r === 'FIRM_ADMIN' || r === 'ADMIN'
      ? [firmHomeQuery]
      : r === 'CLIENT'
        ? [clientHomeQuery]
        : r === 'SUPER_ADMIN'
          ? [firmsListQuery({ limit: 5 })]
          : [userHomeQuery, myTasksQuery({})];
  queries.forEach((q) => queryClient.prefetchQuery(q));
};
