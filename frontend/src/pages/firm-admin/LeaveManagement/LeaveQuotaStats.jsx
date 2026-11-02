import React from 'react';
import { CalendarCheck, Inbox, TreePalm, Thermometer, Umbrella } from 'lucide-react';
import { StatCard } from '../../../components/ui';

// One leave type's card: days left of the yearly quota, or the monthly accrual rate.
const quota = ({ displayQuotaMode, balance, perMonth, total, used, fallback }) => {
  if (displayQuotaMode === 'MONTHLY') return { value: perMonth, hint: 'days a month' };
  if (balance) return { value: (total - used).toFixed(1), hint: `of ${total} days left` };
  return { value: fallback, hint: 'days a year' };
};

export const LeaveQuotaStats = ({ displayQuotaMode, myLeaveData, balance, isAdmin, pendingRequests, setActiveTab }) => {
  const policy = myLeaveData.policy;
  const casual = quota({ displayQuotaMode, balance, perMonth: policy?.perMonthCasual ?? 1.0, total: balance?.casualLeave, used: balance?.casualLeaveUsed, fallback: 12 });
  const sick = quota({ displayQuotaMode, balance, perMonth: policy?.perMonthSick ?? 0.83, total: balance?.sickLeave, used: balance?.sickLeaveUsed, fallback: 10 });
  const earned = quota({ displayQuotaMode, balance, perMonth: policy?.perMonthEarned ?? 1.25, total: balance?.earnedLeave, used: balance?.earnedLeaveUsed, fallback: 15 });

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      <StatCard label="Casual leave" value={casual.value} hint={casual.hint} icon={Umbrella} />
      <StatCard label="Sick leave" value={sick.value} hint={sick.hint} icon={Thermometer} tone="neutral" />
      <StatCard label="Earned leave" value={earned.value} hint={earned.hint} icon={TreePalm} tone="success" />
      {isAdmin ? (
        <StatCard
          label="Waiting for you"
          value={pendingRequests.length}
          hint="requests to review"
          icon={Inbox}
          tone={pendingRequests.length > 0 ? 'warning' : 'neutral'}
          onClick={() => setActiveTab('pending')}
        />
      ) : (
        <StatCard label="My requests" value={myLeaveData.requests?.length || 0} icon={CalendarCheck} tone="neutral" />
      )}
    </div>
  );
};
