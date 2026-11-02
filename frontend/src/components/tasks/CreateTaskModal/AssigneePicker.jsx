import React from 'react';
import { Globe, User, Users } from 'lucide-react';
import { Field, Select } from '../../ui';
import { cn } from '../../../lib/cn';

const SCOPES = [
  { value: 'SINGLE', label: 'One person', icon: User },
  { value: 'MULTIPLE', label: 'A team', icon: Users },
  { value: 'ALL', label: 'Everyone', icon: Globe },
];

export const AssigneePicker = ({ users, assignmentScope, changeScope, selectedUserIds, setSelectedUserIds, handleUserToggle }) => (
  <fieldset className="space-y-3">
    <legend className="text-sm font-medium text-fg mb-1.5">Assign to</legend>
    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Who does this task">
      {SCOPES.map(({ value, label, icon: Icon }) => {
        const on = assignmentScope === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => changeScope(value)}
            className={cn(
              'flex flex-col items-center gap-1 py-2.5 rounded-xl border text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
              on ? 'border-accent bg-accent-soft/50 text-accent-fg' : 'border-line text-muted hover:border-line-strong hover:text-fg'
            )}
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>

    {assignmentScope === 'SINGLE' && (
      <Field label="Employee" required>
        {(p) => (
          <Select
            {...p}
            value={selectedUserIds[0] || ''}
            onChange={(e) => setSelectedUserIds(e.target.value ? [parseInt(e.target.value, 10)] : [])}
          >
            <option value="">Choose an employee</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.firstName} {u.lastName} ({u.designation || 'Staff'})
              </option>
            ))}
          </Select>
        )}
      </Field>
    )}

    {assignmentScope === 'MULTIPLE' && (
      <div>
        <p className="text-sm text-muted mb-1.5">
          Choose the team <span className="text-subtle">({selectedUserIds.length} selected)</span>
        </p>
        <div className="max-h-44 overflow-y-auto rounded-xl border border-line divide-y divide-line">
          {users.map((u) => (
            <label key={u.id} className="flex items-center gap-3 px-3 h-10 text-sm cursor-pointer hover:bg-hover">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-[var(--accent)]"
                checked={selectedUserIds.includes(u.id)}
                onChange={() => handleUserToggle(u.id)}
              />
              <span className="flex-1 text-fg">{u.firstName} {u.lastName}</span>
              <span className="text-xs text-subtle">{u.designation || 'Staff'}</span>
            </label>
          ))}
          {users.length === 0 && <p className="px-3 py-4 text-sm text-muted">No employees found.</p>}
        </div>
      </div>
    )}

    {assignmentScope === 'ALL' && (
      <p className="text-sm text-muted rounded-xl bg-accent-soft/40 border border-accent/20 px-3 py-2.5">
        This task will be assigned to every active employee in the firm.
      </p>
    )}
  </fieldset>
);
