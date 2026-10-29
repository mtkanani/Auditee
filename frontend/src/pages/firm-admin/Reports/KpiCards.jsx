import React from 'react';
import { StatCard } from '../../../components/ui';
import { getKpiList } from './constants';

export const KpiCards = ({ summary }) => {
  if (!summary) return null;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {getKpiList(summary).map((kpi) => (
        <StatCard key={kpi.label} label={kpi.label} value={kpi.val ?? 0} icon={kpi.icon} tone={kpi.tone} />
      ))}
    </div>
  );
};
