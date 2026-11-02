import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { FilterBar, SearchInput, Tabs } from '../../../components/ui';
import { CATEGORIES } from './files';

export const DocumentFilters = ({ search, setSearch, category, setCategory, viewMode, setViewMode }) => (
  <div className="space-y-3">
    <FilterBar>
      <SearchInput value={search} onChange={setSearch} placeholder="Search title, file name or client" className="sm:max-w-md" />
      <div className="sm:ml-auto">
        <Tabs
          aria-label="Layout"
          value={viewMode}
          onChange={setViewMode}
          items={[
            { value: 'grid', label: 'Cards', icon: LayoutGrid },
            { value: 'list', label: 'List', icon: List },
          ]}
        />
      </div>
    </FilterBar>

    {/* Category chips: scroll sideways on phones instead of wrapping into a tall block */}
    <div role="group" aria-label="Category" className="flex gap-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap pb-1 [scrollbar-width:none]">
      {CATEGORIES.map((c) => {
        const on = category === c.value;
        return (
          <button
            key={c.value}
            type="button"
            aria-pressed={on}
            onClick={() => setCategory(c.value)}
            className={cn(
              'h-8 px-3 rounded-full text-xs font-medium whitespace-nowrap border transition-colors',
              on ? 'bg-accent text-on-accent border-transparent' : 'border-line text-muted hover:text-fg hover:border-line-strong'
            )}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  </div>
);
