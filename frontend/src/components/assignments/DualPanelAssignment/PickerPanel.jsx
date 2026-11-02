import React from 'react';
import { Check } from 'lucide-react';
import { SearchInput } from '../../ui';
import { cn } from '../../../lib/cn';

/**
 * A searchable list you pick one item from. Each row is a toggle button.
 * items: [{ id, title, subtitle, meta }]; selectedId; onToggle(item).
 */
export const PickerPanel = ({ icon: Icon, title, hint, items, search, setSearch, searchLabel, selectedId, onToggle, className }) => (
  <section aria-label={title} className={cn('rounded-2xl border border-line bg-surface shadow-card p-4 flex flex-col h-[480px]', className)}>
    <header className="flex items-center gap-2 pb-3">
      <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent-soft text-accent-fg shrink-0">
        <Icon className="w-4 h-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-fg">{title}</h3>
        {hint && <p className="text-xs text-subtle">{hint}</p>}
      </div>
      <span className="text-xs font-medium text-subtle tabular-nums">{items.length}</span>
    </header>

    <SearchInput value={search} onChange={setSearch} placeholder={searchLabel} />

    <ul className="flex-1 overflow-y-auto mt-3 space-y-1.5 pr-1">
      {items.map((item) => {
        const on = selectedId === item.id;
        return (
          <li key={item.id}>
            <button
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(item)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
                on ? 'border-accent bg-accent-soft/50' : 'border-transparent hover:bg-hover'
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-fg truncate">{item.title}</span>
                {item.subtitle && <span className="block text-xs text-subtle truncate">{item.subtitle}</span>}
              </span>
              {item.meta}
              <span className={cn('grid place-items-center w-5 h-5 rounded-full shrink-0', on ? 'bg-accent text-on-accent' : 'border border-line')}>
                {on && <Check className="w-3 h-3" aria-hidden="true" />}
              </span>
            </button>
          </li>
        );
      })}
      {items.length === 0 && <li className="py-8 text-center text-sm text-muted">Nothing matches.</li>}
    </ul>
  </section>
);
