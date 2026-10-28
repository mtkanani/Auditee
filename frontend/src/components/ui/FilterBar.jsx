import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { controlClass } from './controlClass';

/** Row of filters above a list: search on the left, selects/tabs on the right; stacks on mobile. */
export const FilterBar = ({ className, children }) => (
  <div className={cn('flex flex-col sm:flex-row sm:items-center gap-3', className)}>{children}</div>
);

/** Search box with a clear button. Controlled: value + onChange(newValue). */
export const SearchInput = ({ value, onChange, placeholder = 'Search', className, 'aria-label': ariaLabel }) => (
  <div className={cn('relative w-full sm:max-w-xs', className)}>
    <Search className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel || placeholder}
      className={cn(controlClass(false), 'h-10 pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden')}
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        aria-label="Clear search"
        className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-6 h-6 rounded-md text-subtle hover:text-fg hover:bg-hover"
      >
        <X className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    )}
  </div>
);
