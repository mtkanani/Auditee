import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarOff, FileCheck2, ListTodo, Plane, Sun, Video } from 'lucide-react';
import { Badge, Button, Card } from '../../../../components/ui';

const time = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
const LEAVE = { CASUAL_LEAVE: 'Casual leave', SICK_LEAVE: 'Sick leave', EARNED_LEAVE: 'Earned leave', UNPAID_LEAVE: 'Unpaid leave' };
const untilLabel = (d) => {
  const end = new Date(d);
  const today = new Date();
  return end.toDateString() === today.toDateString() ? 'back tomorrow' : `until ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
};

const Row = ({ icon: Icon, tone, title, meta, right, onClick, i }) => (
  <li className="rise" style={{ '--i': i }}>
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-left hover:bg-hover transition-colors focus-visible:outline-none focus-visible:bg-hover"
    >
      <span className={`grid place-items-center w-9 h-9 rounded-xl shrink-0 ${tone}`}>
        <Icon className="w-4 h-4" aria-hidden="true" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-medium text-fg truncate">{title}</span>
        <span className="block text-xs text-muted truncate">{meta}</span>
      </span>
      {right}
    </button>
  </li>
);

/** Today in one list: meetings by time, who is on leave, and what is due before tonight. */
export const TodayAgenda = ({ agenda }) => {
  const navigate = useNavigate();
  const now = Date.now();
  const { meetings, onLeave, dueToday } = agenda;
  const empty = !meetings.length && !onLeave.length && !dueToday.length;
  let i = 0;

  return (
    <Card
      title="Today's agenda"
      description={empty ? 'Nothing scheduled' : `${meetings.length} meetings · ${dueToday.length} due · ${onLeave.length} on leave`}
      className="rise h-full"
      actions={
        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/firm-admin/meetings')}>
          Meetings
        </Button>
      }
    >
      {empty ? (
        <p className="flex items-center gap-2 py-6 text-sm text-muted">
          <Sun className="w-4 h-4 text-warning" aria-hidden="true" />A clear day. No meetings, leave or deadlines today.
        </p>
      ) : (
        <ul className="-mx-2 space-y-0.5">
          {meetings.map((m) => {
            const live = new Date(m.startTime) <= now && new Date(m.endTime) >= now;
            const done = new Date(m.endTime) < now;
            return (
              <Row
                key={`m${m.id}`}
                i={i++}
                icon={Video}
                tone="bg-accent-soft text-accent-fg"
                title={m.title}
                meta={`${time(m.startTime)} – ${time(m.endTime)}${m.location ? ` · ${m.location}` : ''}`}
                right={live ? <Badge tone="success" dot>Now</Badge> : done ? <span className="text-xs text-subtle">Done</span> : <span className="text-xs font-medium text-fg tabular-nums">{time(m.startTime)}</span>}
                onClick={() => navigate('/firm-admin/meetings')}
              />
            );
          })}
          {dueToday.map((d) => (
            <Row
              key={d.key}
              i={i++}
              icon={d.kind === 'filing' ? FileCheck2 : ListTodo}
              tone="bg-danger-soft text-danger"
              title={d.title}
              meta={d.who || (d.kind === 'filing' ? 'Filing' : 'Task')}
              right={<Badge tone="danger">Due today</Badge>}
              onClick={() => navigate(d.kind === 'filing' ? '/firm-admin/compliance' : '/firm-admin/tasks')}
            />
          ))}
          {onLeave.map((l) => (
            <Row
              key={`l${l.id}`}
              i={i++}
              icon={l.leaveType === 'SICK_LEAVE' ? CalendarOff : Plane}
              tone="bg-warning-soft text-warning"
              title={`${l.name} is on leave`}
              meta={`${LEAVE[l.leaveType] || 'Leave'} · ${untilLabel(l.endDate)}`}
              onClick={() => navigate('/firm-admin/leave-management')}
            />
          ))}
        </ul>
      )}
    </Card>
  );
};
