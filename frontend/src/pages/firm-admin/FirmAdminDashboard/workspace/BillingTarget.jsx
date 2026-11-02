import React, { useState } from 'react';
import { Check, Pencil, Target, X } from 'lucide-react';
import { Button, Card } from '../../../../components/ui';
import { useSetBillingTarget } from '../../../../queries/useFirms';
import { inrShort } from '../format';
import { guard } from './guard';

const R = 52;
const C = 2 * Math.PI * R;

const Ring = ({ pct }) => (
  <svg viewBox="0 0 120 120" className="w-32 h-32 -rotate-90" aria-hidden="true">
    <circle cx="60" cy="60" r={R} fill="none" stroke="var(--sunken)" strokeWidth="11" />
    <circle
      cx="60"
      cy="60"
      r={R}
      fill="none"
      stroke={pct >= 100 ? 'var(--chart-done)' : 'var(--accent)'}
      strokeWidth="11"
      strokeLinecap="round"
      strokeDasharray={C}
      strokeDashoffset={C * (1 - Math.min(pct, 100) / 100)}
      className="draw-ring"
      style={{ '--ring-length': C }}
    />
  </svg>
);

/** This month's billing against a goal the admin sets, with the pace needed to reach it. */
export const BillingTarget = ({ target, sample }) => {
  const save = useSetBillingTarget();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  const { monthlyTarget, billed, invoices, daysLeft } = target;
  const pct = monthlyTarget ? Math.round((billed / monthlyTarget) * 100) : 0;
  const remaining = Math.max(0, (monthlyTarget || 0) - billed);
  const monthName = new Date().toLocaleDateString('en-IN', { month: 'long' });

  const open = () => {
    setValue(monthlyTarget ? String(Math.round(monthlyTarget)) : '');
    setEditing(true);
  };
  const submit = guard(sample, () =>
    save.mutate(value.trim() === '' ? null : Number(value.replace(/[^\d.]/g, '')), { onSuccess: () => setEditing(false) })
  );

  return (
    <Card
      title="Monthly billing target"
      description={`${monthName} · ${invoices} invoice${invoices === 1 ? '' : 's'} so far`}
      className="rise h-full"
      actions={
        !editing && monthlyTarget ? (
          <Button size="icon-sm" variant="ghost" aria-label="Change monthly target" onClick={open}>
            <Pencil className="w-4 h-4" aria-hidden="true" />
          </Button>
        ) : null
      }
    >
      {editing ? (
        <form
          className="space-y-3 py-2"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <label className="block text-sm text-muted" htmlFor="billing-target">
            Target for every month, in rupees
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center h-10 px-3 rounded-xl border border-line bg-sunken focus-within:ring-2 focus-within:ring-accent/50">
              <span className="text-sm text-subtle mr-1">₹</span>
              <input
                id="billing-target"
                inputMode="numeric"
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="5,00,000"
                className="flex-1 bg-transparent text-sm text-fg tabular-nums focus:outline-none"
              />
            </div>
            <Button size="icon" variant="primary" type="submit" aria-label="Save target" loading={save.isPending}>
              <Check className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button size="icon" variant="ghost" aria-label="Cancel" onClick={() => setEditing(false)}>
              <X className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
          <p className="text-xs text-subtle">Leave it empty and save to remove the target.</p>
        </form>
      ) : monthlyTarget ? (
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <Ring pct={pct} />
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="text-2xl font-semibold text-fg tabular-nums">{pct}%</p>
                <p className="text-xs text-subtle">of target</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 min-w-0">
            <p className="text-sm text-muted">
              <span className="text-lg font-semibold text-fg tabular-nums">{inrShort(billed)}</span> of {inrShort(monthlyTarget)}
            </p>
            {remaining > 0 ? (
              <p className="text-sm text-muted">
                {inrShort(remaining)} to go
                {daysLeft > 0 && (
                  <>
                    {' '}
                    · about <span className="font-medium text-fg">{inrShort(remaining / daysLeft)}</span> a day for {daysLeft} days
                  </>
                )}
              </p>
            ) : (
              <p className="text-sm font-medium text-success">Target reached. Well done.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3 py-3">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent-soft text-accent-fg">
            <Target className="w-5 h-5" aria-hidden="true" />
          </span>
          <p className="text-sm text-muted">
            Billed <span className="font-medium text-fg">{inrShort(billed)}</span> this month. Set a goal to track progress and the daily pace you need.
          </p>
          <Button size="sm" variant="soft" icon={Target} onClick={open}>
            Set a target
          </Button>
        </div>
      )}
    </Card>
  );
};
