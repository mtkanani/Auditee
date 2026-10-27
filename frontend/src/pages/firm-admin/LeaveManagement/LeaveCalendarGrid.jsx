import React from 'react';
import { Calendar } from 'lucide-react';
import { CardSkeleton } from '../../../components/common/Skeleton';
import { EmptyState } from '../../../components/common/EmptyState';

export const LeaveCalendarGrid = ({ isLoading, calendarEvents }) => (
  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
      <Calendar size="1em" className="text-indigo-400"  />
      <span>Firm Approved Leave Calendar Grid</span>
    </h3>

    {isLoading ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    ) : calendarEvents.length === 0 ? (
      <EmptyState
        title="No Approved Employee Leaves"
        description="No approved employee leaves scheduled for this month."
      />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {calendarEvents.map((ev) => (
          <div key={ev.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-100 text-xs">
                {ev.user?.firstName} {ev.user?.lastName}
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                APPROVED
              </span>
            </div>
            <p className="text-xs text-amber-400 font-bold">
              📅 {new Date(ev.startDate).toLocaleDateString()} to {new Date(ev.endDate).toLocaleDateString()}
            </p>
            <p className="text-xs text-slate-400 line-clamp-2">Reason: {ev.reason}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);
