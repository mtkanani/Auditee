import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/cn';

/** Surface panel. Optional header with title, description and actions. padded={false} for edge-to-edge tables. */
export const Card = ({ title, description, actions, padded = true, className, bodyClassName, children }) => (
  <section className={cn('rounded-2xl bg-surface border border-line shadow-card', className)}>
    {(title || actions) && (
      <header className="flex items-start justify-between gap-4 px-5 pt-4 pb-3">
        <div className="min-w-0">
          {title && <h3 className="text-[15px] font-semibold text-fg leading-6">{title}</h3>}
          {description && <p className="text-sm text-muted mt-0.5">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </header>
    )}
    <div className={cn(padded && (title || actions ? 'px-5 pb-5' : 'p-5'), bodyClassName)}>{children}</div>
  </section>
);

const iconTones = {
  accent: 'bg-accent-soft text-accent-fg',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  neutral: 'bg-hover text-muted',
};

/**
 * Metric tile. value is shown as-is (format money before passing).
 * delta: e.g. "+12%"; trend: 'up' | 'down' colours it; hint: small line under the value.
 */
export const StatCard = ({ label, value, icon: Icon, tone = 'accent', delta, trend = 'up', hint, onClick, className }) => {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        'group relative text-left w-full rounded-2xl bg-surface border border-line shadow-card p-5 overflow-hidden',
        'transition-all duration-200',
        onClick && 'hover:shadow-raised hover:-translate-y-0.5 hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        {Icon && (
          <span className={cn('grid place-items-center w-9 h-9 rounded-xl shrink-0', iconTones[tone])}>
            <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="mt-2 text-[28px] leading-8 font-semibold tracking-tight text-fg tabular-nums">{value}</p>
      {(delta || hint) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {delta && (
            <span className={cn('inline-flex items-center gap-1 font-medium', trend === 'up' ? 'text-success' : 'text-danger')}>
              {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" /> : <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />}
              {delta}
            </span>
          )}
          {hint && <span className="text-subtle">{hint}</span>}
        </div>
      )}
      {/* accent hairline that lights up on hover */}
      <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
    </Wrapper>
  );
};
