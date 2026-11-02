import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import { Avatar } from '../../../../components/common/Avatar';
import { Badge, Button, Card } from '../../../../components/ui';

const SHOWN = 6;
const SEGMENTS = [
  { key: 'overdue', label: 'Overdue', color: 'var(--chart-overdue)' },
  { key: 'dueWeek', label: 'Due this week', color: 'var(--chart-progress)' },
  { key: 'later', label: 'Later', color: 'var(--line-strong)' },
];

/** Open tasks per person, so work goes to whoever has room. Busiest first. */
export const TeamWorkload = ({ workload }) => {
  const navigate = useNavigate();
  const [all, setAll] = useState(false);
  const max = Math.max(1, ...workload.map((w) => w.open));
  const avg = workload.length ? workload.reduce((s, w) => s + w.open, 0) / workload.length : 0;
  const rows = all ? workload : workload.slice(0, SHOWN);

  return (
    <Card
      title="Team workload"
      description={workload.length ? `Open tasks per person · ${avg.toFixed(1)} on average` : 'Open tasks per person'}
      className="rise h-full"
      actions={
        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/firm-admin/tasks')}>
          Tasks
        </Button>
      }
    >
      {workload.length === 0 ? (
        <p className="flex items-center gap-2 py-6 text-sm text-muted">
          <Users className="w-4 h-4 text-subtle" aria-hidden="true" />
          Add employees to see who has room for more work.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {SEGMENTS.map((s) => (
              <span key={s.key} className="flex items-center gap-1.5 text-xs text-muted">
                <span className="w-2 h-2 rounded-sm" style={{ background: s.color }} aria-hidden="true" />
                {s.label}
              </span>
            ))}
          </div>
          <ul className="space-y-3">
            {rows.map((w, i) => {
              const later = Math.max(0, w.open - w.overdue - w.dueWeek);
              const parts = { overdue: w.overdue, dueWeek: w.dueWeek, later };
              const state = w.open === 0 ? ['success', 'Free'] : w.open > avg * 1.4 && w.open >= 4 ? ['warning', 'Busy'] : null;
              return (
                <li key={w.userId} className="flex items-center gap-3">
                  <Avatar firstName={w.name.split(' ')[0]} lastName={w.name.split(' ')[1]} size="sm" className="shrink-0" />
                  <div className="w-36 sm:w-44 min-w-0 shrink-0">
                    <p className="text-sm font-medium text-fg truncate">{w.name}</p>
                    <p className="text-xs text-subtle truncate">{w.designation || 'Staff'}</p>
                  </div>
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    <div
                      className="flex-1 flex h-2.5 rounded-full bg-sunken overflow-hidden gap-px"
                      role="img"
                      aria-label={`${w.name}: ${w.open} open, ${w.overdue} overdue, ${w.dueWeek} due this week`}
                    >
                      {SEGMENTS.map((s) =>
                        parts[s.key] ? (
                          <div key={s.key} className="grow-x h-full" style={{ width: `${(parts[s.key] / max) * 100}%`, background: s.color, '--i': i }} />
                        ) : null
                      )}
                    </div>
                    <span className="w-6 text-right text-sm font-semibold text-fg tabular-nums">{w.open}</span>
                    <span className="hidden sm:block w-12">{state && <Badge tone={state[0]}>{state[1]}</Badge>}</span>
                  </div>
                </li>
              );
            })}
          </ul>
          {workload.length > SHOWN && (
            <button type="button" onClick={() => setAll((v) => !v)} className="text-sm font-medium text-accent-fg hover:underline underline-offset-4">
              {all ? 'Show fewer' : `Show all ${workload.length} people`}
            </button>
          )}
        </div>
      )}
    </Card>
  );
};
