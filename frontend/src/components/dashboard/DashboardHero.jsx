import React from 'react';
import { CalendarDays } from 'lucide-react';
import { cn } from '../../lib/cn';
import { todayLabel } from './dashboardData';

const chipTones = {
  accent: 'bg-accent-soft text-accent-fg',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  neutral: 'bg-hover text-muted',
};

/**
 * Top banner of every dashboard: date, greeting, one-line summary, actions and an optional
 * visual on the right (e.g. a ProgressRing). highlights: [{ label, tone, icon? }] chips under the summary.
 */
export const DashboardHero = ({ title, description, actions, highlights = [], aside, eyebrow = todayLabel() }) => (
  <section className="relative overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
    {/* Decoration only: a soft accent glow and a faint dot grid that fades out to the left. */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-24 -right-16 w-[420px] h-[420px] rounded-full opacity-70 blur-3xl"
      style={{ background: 'radial-gradient(closest-side, color-mix(in oklab, var(--accent) 28%, transparent), transparent)' }}
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:linear-gradient(to_left,black,transparent_70%)]"
      style={{ backgroundImage: 'radial-gradient(var(--line-strong) 1px, transparent 1px)', backgroundSize: '18px 18px' }}
    />

    <div className="relative flex flex-col lg:flex-row lg:items-center gap-6 p-5 sm:p-7">
      <div className="flex-1 min-w-0 space-y-3">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
          <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
          {eyebrow}
        </p>
        <h1 className="text-2xl sm:text-[28px] leading-tight font-semibold tracking-tight text-fg">{title}</h1>
        {description && <p className="text-sm text-muted max-w-2xl">{description}</p>}
        {highlights.length > 0 && (
          <ul className="flex flex-wrap gap-2 pt-1">
            {highlights.map(({ label, tone = 'neutral', icon: Icon }) => (
              <li key={label} className={cn('inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-xs font-medium', chipTones[tone])}>
                {Icon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
                {label}
              </li>
            ))}
          </ul>
        )}
        {actions && <div className="flex flex-wrap gap-2 pt-2">{actions}</div>}
      </div>
      {aside && <div className="shrink-0 self-start lg:self-center">{aside}</div>}
    </div>
  </section>
);
