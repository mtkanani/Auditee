import { cn } from '../../lib/cn';

// Shared look for every text-like control (Input, Select, Textarea, SearchInput).
export const controlClass = (invalid) =>
  cn(
    'w-full rounded-xl bg-sunken text-fg text-sm placeholder:text-subtle',
    'border transition-colors duration-150',
    'focus:outline-none focus:ring-4',
    invalid
      ? 'border-danger/60 focus:border-danger focus:ring-danger/15'
      : 'border-line hover:border-line-strong focus:border-accent focus:ring-accent/15',
    'disabled:opacity-60 disabled:cursor-not-allowed'
  );
