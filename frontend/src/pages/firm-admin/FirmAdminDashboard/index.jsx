import React, { useState } from 'react';
import { AlarmClock, Briefcase, CalendarCheck, MapPin, Receipt, SquareCheckBig, TrendingUp, UserPlus } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { ConfigureGeofenceModal } from '../../../components/attendance/ConfigureGeofenceModal';
import { Button } from '../../../components/ui';
import { DashboardHero } from '../../../components/dashboard/DashboardHero';
import { greeting } from '../../../components/dashboard/dashboardData';
import { ProgressRing } from '../../../components/dashboard/ProgressRing';
import { QuickActions } from '../../../components/dashboard/QuickActions';
import { useTodayData } from './useTodayData';
import { TodayStats } from './TodayStats';
import { AttentionList } from './AttentionList';
import { FeesCollection, TaskBreakdown } from './InsightCards';
import { LeaveApprovals, NewTeamMembers } from './SideCards';

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

const QUICK_ACTIONS = [
  { label: 'New task', hint: 'Assign work to the team', icon: SquareCheckBig, to: '/firm-admin/tasks', state: { openCreate: true } },
  { label: 'New client', hint: 'Add a client record', icon: Briefcase, to: '/firm-admin/clients', state: { openCreate: true } },
  { label: 'New invoice', hint: 'Bill a client', icon: Receipt, to: '/firm-admin/billing', state: { openCreate: true } },
  { label: 'New lead', hint: 'Track a prospect', icon: TrendingUp, to: '/firm-admin/leads', state: { openCreate: true } },
  { label: 'Add a team member', hint: 'Add or manage employees', icon: UserPlus, to: '/firm-admin/users' },
  { label: 'Team attendance', hint: "See who's in today", icon: CalendarCheck, to: '/firm-admin/attendance' },
];

/** Firm admin home: what needs doing today, from live data only. */
export const FirmAdminDashboard = () => {
  const { user } = useAuth();
  const [isGeofenceModalOpen, setIsGeofenceModalOpen] = useState(false);
  const today = useTodayData();
  const { metrics } = today;
  const totalTasks = (metrics.pendingTasks || 0) + (metrics.inProgressTasks || 0) + (metrics.completedTasks || 0);
  const overdueInvoices = today.invoiceSummary.overdueCount || 0;

  const highlights = today.attentionLoading
    ? []
    : [
        { label: `${plural(today.deadlinesThisWeek, 'deadline')} this week`, tone: today.deadlinesThisWeek ? 'warning' : 'success', icon: AlarmClock },
        today.pendingLeave.length ? { label: `${plural(today.pendingLeave.length, 'leave request')} waiting`, tone: 'accent' } : null,
        overdueInvoices ? { label: plural(overdueInvoices, 'overdue invoice'), tone: 'danger', icon: Receipt } : null,
      ].filter(Boolean);

  return (
    <div className="space-y-6 pb-8">
      <DashboardHero
        title={`${greeting()}${user?.firstName ? `, ${user.firstName}` : ''}`}
        description={today.attentionLoading ? 'Getting your day ready…' : "Here's where your firm stands today."}
        highlights={highlights}
        actions={
          <Button size="sm" icon={MapPin} onClick={() => setIsGeofenceModalOpen(true)}>
            Office geofence
          </Button>
        }
        aside={
          <ProgressRing
            value={metrics.completedTasks || 0}
            total={totalTasks}
            label="completed"
            caption={today.isLoading ? undefined : `${metrics.completedTasks || 0} of ${totalTasks} tasks done`}
          />
        }
      />

      <TodayStats metrics={metrics} invoiceSummary={today.invoiceSummary} isLoading={today.isLoading} />

      {/* Side column only from xl: with the sidebar open, lg is too narrow for it. */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2">
          <AttentionList attention={today.attention} invoiceSummary={today.invoiceSummary} loading={today.attentionLoading} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
          <TaskBreakdown metrics={metrics} isLoading={today.isLoading} />
          <FeesCollection invoiceSummary={today.invoiceSummary} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2">
          <QuickActions actions={QUICK_ACTIONS} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
          <LeaveApprovals pendingLeave={today.pendingLeave} loading={today.leaveLoading} />
          <NewTeamMembers recentUsers={today.recentUsers} />
        </div>
      </div>

      <ConfigureGeofenceModal isOpen={isGeofenceModalOpen} onClose={() => setIsGeofenceModalOpen(false)} />
    </div>
  );
};
