import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, IndianRupee, ShieldCheck, SquareCheckBig } from 'lucide-react';
import { StatCard } from '../../../components/ui';
import { inrShort } from './dates';

const show = (v, loading) => (loading ? '—' : v ?? 0);

/** Four clickable headline numbers, all from live data. */
export const TodayStats = ({ metrics, invoiceSummary, isLoading }) => {
  const navigate = useNavigate();
  const openTasks = (metrics.pendingTasks || 0) + (metrics.inProgressTasks || 0);
  const overdueInvoices = invoiceSummary.overdueCount || 0;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        label="Open tasks"
        value={show(openTasks, isLoading)}
        icon={SquareCheckBig}
        hint={isLoading ? undefined : `${metrics.inProgressTasks || 0} in progress`}
        onClick={() => navigate('/firm-admin/tasks')}
      />
      <StatCard
        label="Compliance due"
        value={show(metrics.pendingCompliance, isLoading)}
        icon={ShieldCheck}
        tone={metrics.pendingCompliance ? 'warning' : 'success'}
        hint="upcoming, in progress or overdue"
        onClick={() => navigate('/firm-admin/compliance')}
      />
      <StatCard
        label="Outstanding fees"
        value={invoiceSummary.balanceAmount === undefined ? '—' : inrShort(invoiceSummary.balanceAmount)}
        icon={IndianRupee}
        tone={overdueInvoices ? 'danger' : 'accent'}
        hint={overdueInvoices ? `${overdueInvoices} overdue invoice${overdueInvoices === 1 ? '' : 's'}` : 'nothing overdue'}
        onClick={() => navigate('/firm-admin/billing')}
      />
      <StatCard
        label="Clients"
        value={show(metrics.totalClients, isLoading)}
        icon={Briefcase}
        tone="success"
        hint={isLoading ? undefined : `${metrics.totalUsers || 0} team members`}
        onClick={() => navigate('/firm-admin/clients')}
      />
    </div>
  );
};
