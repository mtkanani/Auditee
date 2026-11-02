import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/cn';
import { greeting } from '../../../components/dashboard/dashboardData';

const chipTones = {
  accent: 'bg-accent-soft text-accent-fg',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
};

const useNow = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
};

/** Completion ring that draws itself in. */
const Ring = ({ done, total }) => {
  const size = 132;
  const stroke = 11;
  const r = (size - stroke) / 2;
  const length = 2 * Math.PI * r;
  const pct = total > 0 ? Math.round((done / total) * 100) : null;
  const offset = pct === null ? length : length * (1 - pct / 100);

  return (
    <figure className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          role="img"
          aria-label={pct === null ? 'No tasks yet' : `${pct}% of tasks completed (${done} of ${total})`}
        >
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
          {pct > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="var(--chart-done)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={length}
              strokeDashoffset={offset}
              className="draw-ring"
              style={{ '--ring-length': length }}
            />
          )}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center" aria-hidden="true">
          <div>
            <p className="text-[28px] font-semibold tabular-nums text-fg leading-none">{pct === null ? '—' : `${pct}%`}</p>
            <p className="text-[11px] text-subtle mt-1">done</p>
          </div>
        </div>
      </div>
      <figcaption className="text-sm text-muted max-w-[10rem]">
        <span className="block text-fg font-medium tabular-nums">
          {done} of {total}
        </span>
        tasks completed
      </figcaption>
    </figure>
  );
};

/** Greeting, live time, today's headline chips, actions and the completion ring. */
export const HomeHero = ({ firstName, summary, chips, actions, done, total }) => {
  const now = useNow();
  const date = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <section className="rise relative overflow-hidden rounded-3xl border border-line bg-surface shadow-card" style={{ '--i': 0 }}>
      {/* Decoration: two soft colour blobs drifting slowly, and a faint grid. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="aurora-a absolute -top-32 right-10 w-[460px] h-[460px] rounded-full blur-3xl opacity-60"
          style={{ background: 'radial-gradient(closest-side, color-mix(in oklab, var(--accent) 35%, transparent), transparent)' }}
        />
        <div
          className="aurora-b absolute -bottom-40 right-64 w-[380px] h-[380px] rounded-full blur-3xl opacity-50"
          style={{ background: 'radial-gradient(closest-side, color-mix(in oklab, var(--chart-done) 30%, transparent), transparent)' }}
        />
        <div
          className="absolute inset-0 opacity-30 [mask-image:linear-gradient(to_left,black,transparent_75%)]"
          style={{ backgroundImage: 'radial-gradient(var(--line-strong) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />
      </div>

      <div className="relative flex flex-col lg:flex-row lg:items-center gap-7 p-6 sm:p-8">
        <div className="flex-1 min-w-0 space-y-4">
          <p className="flex items-center gap-2 text-xs font-medium text-muted">
            <span className="relative flex w-2 h-2" aria-hidden="true">
              <span className="ping-soft absolute inline-flex w-full h-full rounded-full bg-success" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-success" />
            </span>
            {date} · <time className="tabular-nums">{time}</time>
          </p>
          <h1 className="text-[28px] sm:text-[34px] leading-tight font-semibold tracking-tight">
            <span className="text-fg">{greeting()}</span>
            {firstName && (
              <span className="bg-gradient-to-r from-accent to-[var(--chart-done)] bg-clip-text text-transparent">, {firstName}</span>
            )}
          </h1>
          <p className="text-sm sm:text-[15px] text-muted max-w-2xl">{summary}</p>
          {chips.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {chips.map(({ label, tone, icon: Icon }) => (
                <li key={label} className={cn('inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-xs font-medium', chipTones[tone])}>
                  {Icon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
                  {label}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-2 pt-1">{actions}</div>
        </div>
        <div className="shrink-0">
          <Ring done={done} total={total} />
        </div>
      </div>
    </section>
  );
};
