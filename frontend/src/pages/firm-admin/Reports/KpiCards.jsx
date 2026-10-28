import React from 'react';
import { getKpiList } from './constants';

export const KpiCards = ({ summary }) => {
  if (!summary) return null;
  const kpis = getKpiList(summary);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-gradient-to-b ${kpi.color} border ${kpi.border} backdrop-blur-md hover:-translate-y-1 transition-all duration-300 shadow-lg group`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors">
                {kpi.label}
              </span>
              <div className={`p-2 rounded-xl bg-slate-950/60 ${kpi.text}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl md:text-2xl font-black text-fg tracking-tight">{kpi.val}</p>
          </div>
        );
      })}
    </div>
  );
};
