import React from 'react';
import { Building2, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

const FirmStats = ({ stats = { total: 0, active: 0, inactive: 0, suspended: 0 } }) => {
  const cards = [
    {
      title: 'Total Firms',
      value: stats.total,
      icon: Building2,
      bgColor: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400',
      shadowColor: 'shadow-blue-500/5',
    },
    {
      title: 'Active Firms',
      value: stats.active,
      icon: ShieldCheck,
      bgColor: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400',
      shadowColor: 'shadow-emerald-500/5',
    },
    {
      title: 'Inactive Firms',
      value: stats.inactive,
      icon: ShieldAlert,
      bgColor: 'from-slate-500/10 to-slate-700/10 border-slate-500/20 text-slate-400',
      shadowColor: 'shadow-slate-500/5',
    },
    {
      title: 'Suspended Firms',
      value: stats.suspended,
      icon: AlertTriangle,
      bgColor: 'from-amber-500/10 to-rose-500/10 border-amber-500/20 text-amber-400',
      shadowColor: 'shadow-amber-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl border bg-slate-900/40 backdrop-blur-md p-5 flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg bg-gradient-to-tr ${card.bgColor} ${card.shadowColor}`}
          >
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </p>
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {card.value}
              </h3>
            </div>
            <div className={`p-3 rounded-xl bg-slate-950/40 border border-slate-800/80`}>
              <Icon size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FirmStats;
