import React from 'react';
import { Select } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { reportCategories } from './constants';

/** Report picker: grouped pills on wider screens, a grouped dropdown on phones. */
export const ReportTabs = ({ activeTab, onSelectTab }) => (
  <>
    <div className="md:hidden">
      <Select aria-label="Report" value={activeTab} onChange={(e) => onSelectTab(e.target.value)}>
        {reportCategories.map((c) => (
          <optgroup key={c.categoryName} label={c.categoryName}>
            {c.tabs.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </optgroup>
        ))}
      </Select>
    </div>

    <div role="tablist" aria-label="Reports" className="hidden md:flex flex-wrap gap-x-6 gap-y-3 rounded-2xl border border-line bg-surface p-3">
      {reportCategories.map((category) => (
        <div key={category.categoryName} className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-subtle pr-1">{category.categoryName}</span>
          {category.tabs.map((tab) => {
            const Icon = tab.icon;
            const on = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => onSelectTab(tab.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
                  on ? 'bg-accent text-on-accent shadow-glow' : 'text-muted hover:text-fg hover:bg-hover'
                )}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  </>
);
