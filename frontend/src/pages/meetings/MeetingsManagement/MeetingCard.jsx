import React from 'react';
import { CalendarClock, CheckCheck, FileText, Play, Users } from 'lucide-react';
import { Badge, Button } from '../../../components/ui';
import { meetingState, modeInfo, typeLabel, whenLabel } from './meetingFormat';

const STATE_BADGE = {
  live: { tone: 'success', label: 'Live now' },
  scheduled: { tone: 'neutral', label: 'Scheduled' },
  completed: { tone: 'success', label: 'Completed' },
  cancelled: { tone: 'danger', label: 'Cancelled' },
};

export const MeetingCard = ({ meeting, canSchedule, onJoin, joining, onNotes, onClose }) => {
  const state = meetingState(meeting);
  const closed = state === 'completed' || state === 'cancelled';
  const badge = STATE_BADGE[state];
  const mode = modeInfo(meeting.meetingMode);
  const ModeIcon = mode.icon;
  const people = meeting.participants?.length || 0;

  return (
    <article className="flex flex-col rounded-2xl border border-line bg-surface shadow-card p-5 transition-all duration-150 hover:border-line-strong hover:shadow-raised">
      <div className="flex items-center justify-between gap-2 mb-3">
        <Badge tone="accent">{typeLabel(meeting.meetingType)}</Badge>
        <Badge tone={badge.tone} dot className={state === 'live' ? '[&>span:first-child]:animate-pulse' : undefined}>
          {badge.label}
        </Badge>
      </div>

      <h3 className="text-sm font-semibold text-fg line-clamp-2">{meeting.title}</h3>
      {meeting.agenda && <p className="text-sm text-muted line-clamp-2 mt-1">{meeting.agenda}</p>}

      <dl className="space-y-1.5 text-xs text-muted border-y border-line py-3 my-4">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-3.5 h-3.5 text-subtle shrink-0" aria-hidden="true" />
          <dt className="sr-only">When</dt>
          <dd className="tabular-nums">{whenLabel(meeting)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <ModeIcon className="w-3.5 h-3.5 text-subtle shrink-0" aria-hidden="true" />
          <dt className="sr-only">Where</dt>
          <dd className="truncate">{meeting.meetingMode === 'IN_PERSON' && meeting.location ? meeting.location : mode.label}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-subtle shrink-0" aria-hidden="true" />
          <dt className="sr-only">Invited</dt>
          <dd>{people === 1 ? '1 person invited' : `${people} people invited`}</dd>
        </div>
      </dl>

      <div className="flex items-center gap-2 mt-auto">
        {closed ? (
          <span className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl bg-hover text-muted text-sm font-medium">
            <CheckCheck className="w-4 h-4" aria-hidden="true" /> Meeting closed
          </span>
        ) : (
          <Button variant="primary" icon={Play} loading={joining} onClick={() => onJoin(meeting)} className="flex-1">
            {state === 'live' ? 'Join now' : 'Join'}
          </Button>
        )}
        <Button size="icon" aria-label={`Notes for ${meeting.title}`} title="Meeting notes" onClick={() => onNotes(meeting)}>
          <FileText className="w-4 h-4" />
        </Button>
        {canSchedule && !closed && (
          <Button size="icon" variant="soft" aria-label={`Mark ${meeting.title} as done`} title="Mark as done" onClick={() => onClose(meeting.id)}>
            <CheckCheck className="w-4 h-4" />
          </Button>
        )}
      </div>
    </article>
  );
};
