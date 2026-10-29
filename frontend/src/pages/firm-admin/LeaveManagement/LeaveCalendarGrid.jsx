import React from 'react';
import { CalendarDays, CalendarX } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { CardSkeleton } from '../../../components/common/Skeleton';
import { EmptyState } from '../../../components/common/EmptyState';
import { dateRange } from './leaveFormat';

/** Approved leave in the chosen month, one card per absence. */
export const LeaveCalendarGrid = ({ isLoading, calendarEvents }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (calendarEvents.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-surface">
        <EmptyState icon={CalendarX} title="No one is away" description="No approved leave falls in this month." />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {calendarEvents.map((ev) => (
        <article key={ev.id} className="rounded-2xl border border-line bg-surface shadow-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar firstName={ev.user?.firstName} lastName={ev.user?.lastName} size="sm" className="shrink-0" />
            <p className="text-sm font-medium text-fg truncate">
              {ev.user?.firstName} {ev.user?.lastName}
            </p>
          </div>
          <p className="flex items-center gap-1.5 text-sm text-fg">
            <CalendarDays className="w-4 h-4 text-subtle" aria-hidden="true" />
            {dateRange(ev.startDate, ev.endDate)}
          </p>
          {ev.reason && <p className="text-xs text-muted line-clamp-2">{ev.reason}</p>}
        </article>
      ))}
    </div>
  );
};
