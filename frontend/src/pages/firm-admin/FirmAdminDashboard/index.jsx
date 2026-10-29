import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { ConfigureGeofenceModal } from '../../../components/attendance/ConfigureGeofenceModal';
import { Button, PageHeader } from '../../../components/ui';
import { useTodayData } from './useTodayData';
import { greeting, todayLabel } from './dates';
import { TodayStats } from './TodayStats';
import { AttentionList } from './AttentionList';
import { LeaveApprovals, NewTeamMembers, TaskProgress } from './SideCards';

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** Firm admin home: what needs doing today, from live data only. */
export const FirmAdminDashboard = () => {
  const { user } = useAuth();
  const [isGeofenceModalOpen, setIsGeofenceModalOpen] = useState(false);
  const today = useTodayData();

  const summary = [
    plural(today.deadlinesThisWeek, 'deadline') + ' this week',
    today.pendingLeave.length ? plural(today.pendingLeave.length, 'leave request') + ' waiting' : null,
    today.invoiceSummary.overdueCount ? plural(today.invoiceSummary.overdueCount, 'overdue invoice') : null,
  ].filter(Boolean).join(' · ');

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        eyebrow={todayLabel()}
        title={`${greeting()}${user?.firstName ? `, ${user.firstName}` : ''}`}
        description={today.attentionLoading ? 'Getting your day ready…' : summary}
        actions={
          <Button icon={MapPin} onClick={() => setIsGeofenceModalOpen(true)}>
            Office geofence
          </Button>
        }
      />

      <TodayStats metrics={today.metrics} invoiceSummary={today.invoiceSummary} isLoading={today.isLoading} />

      {/* Side column only from xl: with the sidebar open, lg is too narrow for it. */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2">
          <AttentionList attention={today.attention} invoiceSummary={today.invoiceSummary} loading={today.attentionLoading} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
          <LeaveApprovals pendingLeave={today.pendingLeave} loading={today.leaveLoading} />
          <TaskProgress metrics={today.metrics} isLoading={today.isLoading} />
          <NewTeamMembers recentUsers={today.recentUsers} />
        </div>
      </div>

      <ConfigureGeofenceModal isOpen={isGeofenceModalOpen} onClose={() => setIsGeofenceModalOpen(false)} />
    </div>
  );
};
