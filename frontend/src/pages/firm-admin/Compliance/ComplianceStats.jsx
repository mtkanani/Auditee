import React from 'react';
import { CircleCheckBig, Clock, Shield, TriangleAlert } from 'lucide-react';
import { StatsCard } from '../../../components/common/StatsCard';

export const ComplianceStats = ({ totalItems, pendingCount, overdueCount, filedCount }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    <StatsCard title="Total Compliance Items" value={totalItems} icon={Shield} color="indigo" />
    <StatsCard title="Pending Statutory Filings" value={pendingCount} icon={Clock} color="amber" />
    <StatsCard title="Overdue Deadlines" value={overdueCount} icon={TriangleAlert} color="rose" />
    <StatsCard title="Filed This Period" value={filedCount} icon={CircleCheckBig} color="emerald" />
  </div>
);
