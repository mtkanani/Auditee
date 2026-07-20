import React from 'react';
import { FiFolderMinus } from 'react-icons/fi';

export const EmptyState = ({
  icon: Icon = FiFolderMinus,
  title = 'No data found',
  description = 'There are no records matching your request at this time.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center my-6 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
      <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-200">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mt-1 mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
