import React from 'react';
import { MapPin } from 'lucide-react';

const time = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

/** Check-in or check-out time with the place it was recorded. */
export const Punch = ({ at, place, empty }) => (
  <div className="min-w-0">
    <p className={at ? 'text-sm font-medium text-fg tabular-nums' : 'text-sm text-subtle'}>{at ? time(at) : empty}</p>
    {place && (
      <p className="flex items-center gap-1 text-xs text-subtle mt-0.5 truncate max-w-[200px]">
        <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
        <span className="truncate">{place}</span>
      </p>
    )}
  </div>
);
