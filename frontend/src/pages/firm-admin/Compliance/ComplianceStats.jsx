import React from 'react';
import { CircleCheckBig, Clock, ShieldCheck, TriangleAlert } from 'lucide-react';
import { StatCard } from '../../../components/ui';

/** Counts come from the server summary, so they cover every matching filing. */
export const ComplianceStats = ({ totalItems, pendingCount, overdueCount, filedCount, setStatusFilter }) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
    <StatCard label="All filings" value={totalItems} icon={ShieldCheck} />
    <StatCard label="Pending" value={pendingCount} icon={Clock} tone="warning" hint="upcoming or in progress" />
    <StatCard
      label="Overdue"
      value={overdueCount}
      icon={TriangleAlert}
      tone={overdueCount ? 'danger' : 'neutral'}
      hint={overdueCount ? 'show only these' : 'nothing overdue'}
      onClick={overdueCount ? () => setStatusFilter('OVERDUE') : undefined}
    />
    <StatCard label="Filed" value={filedCount} icon={CircleCheckBig} tone="success" />
  </div>
);
