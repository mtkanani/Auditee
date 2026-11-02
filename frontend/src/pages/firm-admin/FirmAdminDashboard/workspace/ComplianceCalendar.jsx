import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarCheck, FileCheck2 } from 'lucide-react';
import { Badge, Button, Card } from '../../../../components/ui';
import { cn } from '../../../../lib/cn';

const DAYS = 30;
const dayKey = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${x.getMonth()}-${x.getDate()}`;
};

/** GST, TDS, ROC stay as they are; INCOME_TAX becomes Income tax. */
const categoryLabel = (c = '') => (c.length <= 3 ? c || 'Filing' : c.charAt(0) + c.slice(1).toLowerCase().replace(/_/g, ' '));

// Busier days get a stronger dot, so the heavy dates (GST on the 11th and 20th, TDS on the 7th) stand out.
const loadTone = (n) => (n >= 5 ? 'bg-danger' : n >= 3 ? 'bg-warning' : 'bg-accent');

/** The next 30 days of open filings as a strip; pick a day to see what is due and for whom. */
export const ComplianceCalendar = ({ items }) => {
  const navigate = useNavigate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const byDay = {};
  for (const it of items) (byDay[dayKey(it.dueDate)] ||= []).push(it);
  const days = Array.from({ length: DAYS }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i));
  const firstBusy = days.find((d) => byDay[dayKey(d)]);
  const [picked, setPicked] = useState(null);
  const selected = picked || firstBusy || today;
  const list = byDay[dayKey(selected)] || [];
  const busiest = Math.max(0, ...Object.values(byDay).map((l) => l.length));

  return (
    <Card
      title="Compliance calendar"
      description={items.length ? `${items.length} filings due in the next 30 days${busiest > 1 ? ` · busiest day has ${busiest}` : ''}` : 'Nothing due in the next 30 days'}
      className="rise"
      actions={
        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => navigate('/firm-admin/compliance')}>
          Compliance
        </Button>
      }
    >
      <div className="-mx-1 overflow-x-auto pb-1">
        <div className="flex gap-1.5 px-1 min-w-max" role="listbox" aria-label="Choose a day">
          {days.map((d) => {
            const n = byDay[dayKey(d)]?.length || 0;
            const on = dayKey(d) === dayKey(selected);
            const isToday = dayKey(d) === dayKey(today);
            const weekend = d.getDay() === 0 || d.getDay() === 6;
            return (
              <button
                key={d.toISOString()}
                type="button"
                role="option"
                aria-selected={on}
                aria-label={`${d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}: ${n ? `${n} due` : 'nothing due'}`}
                onClick={() => setPicked(d)}
                className={cn(
                  'flex flex-col items-center justify-between w-11 h-16 py-1.5 rounded-xl border text-center transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
                  on ? 'border-accent bg-accent-soft/60' : 'border-line hover:border-line-strong',
                  weekend && !on && 'bg-sunken/60'
                )}
              >
                <span className={cn('text-[10px] font-medium uppercase', isToday ? 'text-accent-fg' : 'text-subtle')}>
                  {isToday ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, 3)}
                </span>
                <span className={cn('text-sm font-semibold tabular-nums', on ? 'text-accent-fg' : 'text-fg')}>{d.getDate()}</span>
                <span className="flex items-center gap-0.5 h-1.5" aria-hidden="true">
                  {n > 0 &&
                    Array.from({ length: Math.min(n, 3) }).map((_, i) => <span key={i} className={cn('w-1.5 h-1.5 rounded-full', loadTone(n))} />)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-line">
        <p className="px-4 pt-3 pb-2 text-sm font-medium text-fg">
          {selected.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          <span className="ml-2 text-xs font-normal text-subtle">{list.length ? `${list.length} due` : 'nothing due'}</span>
        </p>
        {list.length === 0 ? (
          <p className="flex items-center gap-2 px-4 pb-4 text-sm text-muted">
            <CalendarCheck className="w-4 h-4 text-success" aria-hidden="true" />
            No filings on this day.
          </p>
        ) : (
          <ul className="divide-y divide-line border-t border-line">
            {list.map((it) => (
              <li key={it.id} className="flex items-center gap-3 px-4 py-2.5">
                <FileCheck2 className="w-4 h-4 text-subtle shrink-0" aria-hidden="true" />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm text-fg truncate">{it.title}</span>
                  <span className="block text-xs text-muted truncate">{it.client || 'All clients'}</span>
                </span>
                <Badge tone={it.status === 'IN_PROGRESS' ? 'accent' : 'neutral'}>{categoryLabel(it.category)}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};
