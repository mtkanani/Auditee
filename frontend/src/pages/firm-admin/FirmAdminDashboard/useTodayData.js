import { useMemo } from 'react';
import { useFirmAdminDashboard } from '../../../queries/useFirms';
import { useComplianceItems } from '../../../queries/useCompliance';
import { useFirmInvoices } from '../../../queries/useInvoices';
import { usePendingLeaveRequests } from '../../../queries/useLeave';
import { daysUntil } from './dates';

/** Everything the Today dashboard shows, from the existing queries (all real data). */
export const useTodayData = () => {
  const { dashboard, isLoading: loadingDashboard } = useFirmAdminDashboard();
  // Server sorts compliance by due date, so the first page is the nearest deadlines.
  const overdueCompliance = useComplianceItems({ page: 1, limit: 5, status: 'OVERDUE' });
  const upcomingCompliance = useComplianceItems({ page: 1, limit: 8, status: 'UPCOMING' });
  const invoices = useFirmInvoices({ page: 1, limit: 1 });
  const leave = usePendingLeaveRequests({ enabled: true });

  const metrics = dashboard?.metrics || {};
  const invoiceSummary = invoices.summary || {};
  const pendingLeave = leave.data?.pendingRequests || [];

  // Overdue first, then anything due within the next 7 days (UPCOMING items whose date has passed count as overdue).
  const attention = useMemo(() => {
    const rows = [
      ...overdueCompliance.items,
      ...upcomingCompliance.items.filter((c) => daysUntil(c.dueDate) <= 7),
    ].map((c) => ({
      id: `c-${c.id}`,
      kind: 'compliance',
      title: c.title,
      subtitle: c.client?.companyName || c.client?.clientName || 'All clients',
      dueDate: c.dueDate,
    }));
    const seen = new Set();
    return rows
      .filter((r) => (seen.has(r.id) ? false : seen.add(r.id)))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [overdueCompliance.items, upcomingCompliance.items]);

  return {
    metrics,
    recentUsers: dashboard?.recentUsers || [],
    invoiceSummary,
    pendingLeave,
    attention,
    deadlinesThisWeek: attention.length,
    isLoading: loadingDashboard,
    attentionLoading: overdueCompliance.isLoading || upcomingCompliance.isLoading,
    leaveLoading: leave.isLoading,
  };
};
