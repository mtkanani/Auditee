import React from 'react';
import { Calendar, CircleCheckBig, Clock, TriangleAlert } from 'lucide-react';
import { StatsCard } from '../../../components/common/StatsCard';

export const LeaveQuotaStats = ({ displayQuotaMode, myLeaveData, balance, isAdmin, pendingRequests }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    <StatsCard
      title="Casual Leave (CL)"
      value={
        displayQuotaMode === 'MONTHLY'
          ? `${myLeaveData.policy?.perMonthCasual ?? 1.0} Days / Month`
          : balance
          ? `${(balance.casualLeave - balance.casualLeaveUsed).toFixed(1)} / ${balance.casualLeave} Days`
          : '12 Days'
      }
      icon={Calendar}
      color="indigo"
    />
    <StatsCard
      title="Sick Leave (SL)"
      value={
        displayQuotaMode === 'MONTHLY'
          ? `${myLeaveData.policy?.perMonthSick ?? 0.83} Days / Month`
          : balance
          ? `${(balance.sickLeave - balance.sickLeaveUsed).toFixed(1)} / ${balance.sickLeave} Days`
          : '10 Days'
      }
      icon={Clock}
      color="purple"
    />
    <StatsCard
      title="Earned Leave (EL)"
      value={
        displayQuotaMode === 'MONTHLY'
          ? `${myLeaveData.policy?.perMonthEarned ?? 1.25} Days / Month`
          : balance
          ? `${(balance.earnedLeave - balance.earnedLeaveUsed).toFixed(1)} / ${balance.earnedLeave} Days`
          : '15 Days'
      }
      icon={CircleCheckBig}
      color="emerald"
    />
    <StatsCard
      title={isAdmin ? 'Pending Approval Inbox' : 'My Total Requests'}
      value={isAdmin ? pendingRequests.length : myLeaveData.requests?.length || 0}
      icon={TriangleAlert}
      color="amber"
    />
  </div>
);
