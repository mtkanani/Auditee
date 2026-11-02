import React, { useState } from 'react';
import { Globe, Search, Users } from 'lucide-react';
import { useFirmUsers } from '../../queries/useLookups';
import { cn } from '../../lib/cn';

const OPTIONS = [
  { value: 'ALL', label: 'Everyone', hint: 'All staff', icon: Globe },
  { value: 'SELECTED', label: 'Chosen people', hint: 'Only who you pick', icon: Users },
];

/** Who a notice goes to: the whole firm, or employees picked from a searchable list. */
export const NoticeAudiencePicker = ({ audience, onAudience, selected, onSelected }) => {
  const [search, setSearch] = useState('');
  const { data: users = [], isLoading, isError } = useFirmUsers({ limit: 100 }, { enabled: audience === 'SELECTED' });
  const q = search.trim().toLowerCase();
  const shown = q ? users.filter((u) => `${u.firstName} ${u.lastName} ${u.designation || ''}`.toLowerCase().includes(q)) : users;
  const toggle = (id) => onSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  const allShownOn = shown.length > 0 && shown.every((u) => selected.includes(u.id));

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-fg mb-1.5">Send to</legend>
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Who receives this notice">
        {OPTIONS.map(({ value, label, hint, icon: Icon }) => {
          const on = audience === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onAudience(value)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
                on ? 'border-accent bg-accent-soft/50' : 'border-line hover:border-line-strong'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', on ? 'text-accent-fg' : 'text-muted')} aria-hidden="true" />
              <span>
                <span className={cn('block text-sm font-medium', on ? 'text-accent-fg' : 'text-fg')}>{label}</span>
                <span className="block text-xs text-subtle">{hint}</span>
              </span>
            </button>
          );
        })}
      </div>

      {audience === 'SELECTED' && (
        <div className="rounded-xl border border-line overflow-hidden">
          <div className="flex items-center gap-2 px-3 h-10 border-b border-line bg-sunken">
            <Search className="w-4 h-4 text-subtle shrink-0" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people"
              aria-label="Search people"
              className="flex-1 bg-transparent text-sm text-fg placeholder:text-subtle focus:outline-none"
            />
            <button
              type="button"
              onClick={() => onSelected(allShownOn ? selected.filter((id) => !shown.some((u) => u.id === id)) : [...new Set([...selected, ...shown.map((u) => u.id)])])}
              className="text-xs font-medium text-accent-fg hover:underline underline-offset-4 shrink-0"
            >
              {allShownOn ? 'Clear' : 'Select all'}
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto divide-y divide-line">
            {isLoading ? (
              <p className="px-3 py-4 text-sm text-muted">Loading people…</p>
            ) : isError ? (
              <p className="px-3 py-4 text-sm text-danger">Couldn't load your people. Close and try again.</p>
            ) : shown.length === 0 ? (
              <p className="px-3 py-4 text-sm text-muted">{q ? 'No one matches.' : 'No employees yet.'}</p>
            ) : (
              shown.map((u) => (
                <label key={u.id} className="flex items-center gap-3 px-3 h-10 text-sm cursor-pointer hover:bg-hover">
                  <input type="checkbox" className="w-4 h-4 rounded accent-[var(--accent)]" checked={selected.includes(u.id)} onChange={() => toggle(u.id)} />
                  <span className="flex-1 text-fg truncate">
                    {u.firstName} {u.lastName}
                  </span>
                  <span className="text-xs text-subtle truncate">{u.designation || 'Staff'}</span>
                </label>
              ))
            )}
          </div>
          <p className="px-3 py-2 text-xs text-muted border-t border-line bg-sunken" aria-live="polite">
            {selected.length ? `${selected.length} ${selected.length === 1 ? 'person' : 'people'} will get this notice and a notification right away.` : 'Pick at least one person.'}
          </p>
        </div>
      )}
    </fieldset>
  );
};
