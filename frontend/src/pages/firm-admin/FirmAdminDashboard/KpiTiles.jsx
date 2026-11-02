import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, IndianRupee, ShieldCheck, SquareCheckBig } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { useCountUp } from '../../../hooks/useCountUp';
import { inrShort, plural } from './format';

const tones = {
  accent: 'bg-accent-soft text-accent-fg',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  success: 'bg-success-soft text-success',
};

const Tile = ({ i, label, value, format = (v) => Math.round(v).toLocaleString('en-IN'), hint, icon: Icon, tone, to }) => {
  const navigate = useNavigate();
  const shown = useCountUp(value);
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="rise group relative overflow-hidden text-left rounded-2xl border border-line bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-raised hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      style={{ '--i': i }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        <span className={cn('grid place-items-center w-9 h-9 rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-110', tones[tone])}>
          <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 text-[30px] leading-9 font-semibold tracking-tight text-fg tabular-nums" aria-live="polite">
        {format(shown)}
      </p>
      <p className="mt-1 text-xs text-subtle truncate">{hint}</p>
      <span
        aria-hidden="true"
        className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </button>
  );
};

/** Four headline numbers that count up; each opens its page. */
export const KpiTiles = ({ metrics, invoices }) => {
  const open = metrics.pendingTasks + metrics.inProgressTasks + metrics.underReviewTasks;
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      <Tile i={1} label="Open tasks" value={open} icon={SquareCheckBig} tone="accent" to="/firm-admin/tasks" hint={`${metrics.inProgressTasks} in progress`} />
      <Tile
        i={2}
        label="Compliance due"
        value={metrics.pendingCompliance}
        icon={ShieldCheck}
        tone={metrics.pendingCompliance ? 'warning' : 'success'}
        to="/firm-admin/compliance"
        hint="upcoming, in progress or overdue"
      />
      <Tile
        i={3}
        label="Outstanding fees"
        value={invoices.balanceAmount}
        format={inrShort}
        icon={IndianRupee}
        tone={invoices.overdueCount ? 'danger' : 'accent'}
        to="/firm-admin/billing"
        hint={invoices.overdueCount ? `${plural(invoices.overdueCount, 'overdue invoice')}` : 'nothing overdue'}
      />
      <Tile
        i={4}
        label="Clients"
        value={metrics.totalClients}
        icon={Briefcase}
        tone="success"
        to="/firm-admin/clients"
        hint={plural(metrics.totalUsers, 'team member')}
      />
    </div>
  );
};
