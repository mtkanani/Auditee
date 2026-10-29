import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

/** Page numbers to show: always the first, last and the pages either side of the current one. */
const pageList = (current, total) => {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(p - sorted[i - 1] === 2 ? p - 1 : `gap-${p}`);
    out.push(p);
  });
  return out;
};

const btn =
  'inline-flex items-center justify-center h-8 min-w-8 px-2 rounded-lg text-sm font-medium tabular-nums transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-40 disabled:pointer-events-none';

/**
 * Record count and page controls. Has no border or background of its own, so it sits inside
 * a Table footer or a bordered box (add a divider yourself when placing it under other content).
 */
export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalRecords = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
}) => {
  const pages = Math.max(totalPages || 1, 1);
  const startRecord = totalRecords > 0 ? (currentPage - 1) * limit + 1 : 0;
  const endRecord = Math.min(currentPage * limit, totalRecords);
  const go = (p) => p >= 1 && p <= pages && p !== currentPage && onPageChange(p);

  return (
    <nav aria-label="Pagination" className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-3">
      <p className="text-sm text-muted" aria-live="polite">
        {totalRecords > 0 ? (
          <>
            Showing <span className="font-medium text-fg tabular-nums">{startRecord}–{endRecord}</span> of{' '}
            <span className="font-medium text-fg tabular-nums">{totalRecords}</span>
          </>
        ) : (
          'No results'
        )}
      </p>

      <div className="flex items-center gap-3">
        {onLimitChange && (
          <label className="flex items-center gap-2 text-sm text-muted">
            Rows
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="h-8 rounded-lg bg-sunken border border-line px-2 text-sm text-fg focus:outline-none focus:border-accent"
            >
              {[5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        )}

        {pages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => go(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label="Previous page"
              className={cn(btn, 'text-muted hover:text-fg hover:bg-hover')}
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Phones: compact "Page 4 of 12" */}
            <span className="sm:hidden px-2 text-sm text-muted tabular-nums">
              Page <span className="font-medium text-fg">{currentPage}</span> of {pages}
            </span>

            {/* Wider screens: numbered pages */}
            <ul className="hidden sm:flex items-center gap-1">
              {pageList(currentPage, pages).map((p) =>
                typeof p === 'string' ? (
                  <li key={p} className="w-6 text-center text-sm text-subtle" aria-hidden="true">…</li>
                ) : (
                  <li key={p}>
                    <button
                      type="button"
                      onClick={() => go(p)}
                      aria-label={`Page ${p}`}
                      aria-current={p === currentPage ? 'page' : undefined}
                      className={cn(btn, p === currentPage ? 'bg-accent-soft text-accent-fg' : 'text-muted hover:text-fg hover:bg-hover')}
                    >
                      {p}
                    </button>
                  </li>
                )
              )}
            </ul>

            <button
              type="button"
              onClick={() => go(currentPage + 1)}
              disabled={currentPage >= pages}
              aria-label="Next page"
              className={cn(btn, 'text-muted hover:text-fg hover:bg-hover')}
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
