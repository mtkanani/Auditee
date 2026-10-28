import React from 'react';
import { CalendarRange, Repeat, Save } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { Button, Field, Input } from '../../ui';
import { cn } from '../../../lib/cn';
import { useLeavePolicyForm } from './useLeavePolicyForm';

const MODES = [
  { value: 'YEARLY', title: 'Per year', detail: 'Full yearly quota given upfront', icon: CalendarRange },
  { value: 'MONTHLY', title: 'Per month', detail: 'Leave builds up each month', icon: Repeat },
];

export const ConfigureLeavePolicyModal = ({ isOpen, onClose, currentPolicy, onPolicyUpdated }) => {
  const { accrualMode, setAccrualMode, quotas, updateAllBalances, setUpdateAllBalances, handleSubmit, updatePolicyMutation } =
    useLeavePolicyForm({ currentPolicy, onClose, onPolicyUpdated });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave policy" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-sm text-muted">
          Firm-wide leave allowances. Change either number and the other updates (a year is 12 months).
        </p>

        <fieldset>
          <legend className="text-sm font-medium text-fg mb-1.5">How leave is given</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {MODES.map((m) => {
              const Icon = m.icon;
              const on = accrualMode === m.value;
              return (
                <label
                  key={m.value}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors',
                    on ? 'border-accent bg-accent-soft/50' : 'border-line hover:border-line-strong'
                  )}
                >
                  <input type="radio" name="accrualMode" className="mt-1 accent-[var(--accent)]" checked={on} onChange={() => setAccrualMode(m.value)} />
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-fg">{m.title}</span>
                    <span className="block text-xs text-muted">{m.detail}</span>
                  </span>
                  <Icon className={cn('w-5 h-5 shrink-0', on ? 'text-accent-fg' : 'text-subtle')} aria-hidden="true" />
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quotas.map((q) => (
            <fieldset key={q.key} className="rounded-xl border border-line bg-sunken/40 p-3 space-y-3">
              <legend className="sr-only">{q.title}</legend>
              <p className="text-sm font-medium text-fg" aria-hidden="true">{q.title}</p>
              <Field label="Days a year">
                {(p) => <Input {...p} type="number" step="0.5" min="0" value={q.year} onChange={(e) => q.onYear(e.target.value)} className="h-9" />}
              </Field>
              <Field label="Days a month">
                {(p) => <Input {...p} type="number" step="0.1" min="0" value={q.month} onChange={(e) => q.onMonth(e.target.value)} className="h-9" />}
              </Field>
            </fieldset>
          ))}
        </div>

        <label className="flex items-start gap-3 p-3 rounded-xl border border-line text-sm text-fg cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 w-4 h-4 rounded accent-[var(--accent)]"
            checked={updateAllBalances}
            onChange={(e) => setUpdateAllBalances(e.target.checked)}
          />
          <span>Update existing employee balances to match these new quota limits</span>
        </label>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" icon={Save} loading={updatePolicyMutation.isPending}>Save policy</Button>
        </div>
      </form>
    </Modal>
  );
};
