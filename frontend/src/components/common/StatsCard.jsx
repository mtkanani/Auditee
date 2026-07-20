import React from 'react';
import { motion } from 'framer-motion';

export const StatsCard = ({ title, value, icon: Icon, change, trend = 'up', color = 'indigo' }) => {
  const colorStyles = {
    indigo: 'from-indigo-500/20 to-purple-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/20',
    rose: 'from-rose-500/20 to-red-500/10 text-rose-400 border-rose-500/20',
    blue: 'from-blue-500/20 to-cyan-500/10 text-blue-400 border-blue-500/20',
  }[color] || 'from-indigo-500/20 to-purple-500/10 text-indigo-400 border-indigo-500/20';

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 dark:border-slate-800 shadow-xl overflow-hidden group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="text-3xl font-bold text-slate-100 mt-2 tracking-tight">{value}</h3>
          
          {change && (
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold">
              <span className={trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}>
                {trend === 'up' ? '↑' : '↓'} {change}
              </span>
              <span className="text-slate-500">vs last month</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl bg-gradient-to-br border ${colorStyles} shadow-inner`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Decorative gradient glow on card edge */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};
