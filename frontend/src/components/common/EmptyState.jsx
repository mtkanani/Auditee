import React from 'react';
import { FolderMinus } from 'lucide-react';

/** Centred "nothing here" message. Borderless, so it sits inside tables and cards. */
export const EmptyState = ({
  icon: Icon = FolderMinus,
  title = 'No data found',
  description = 'There are no records matching your request at this time.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <span className="grid place-items-center w-12 h-12 rounded-2xl bg-accent-soft text-accent-fg mb-4">
        <Icon className="w-6 h-6" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-fg">{title}</h3>
      <p className="text-sm text-muted max-w-sm mt-1">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
