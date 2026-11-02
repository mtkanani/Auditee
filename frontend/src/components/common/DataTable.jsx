import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TableSkeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

/**
 * Plain themed table with no card of its own, for pages that wrap it in their own box.
 * New screens should use the kit Table, which brings the card, loading and empty states.
 */
export const DataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyState,
  sortBy,
  sortOrder,
  onSort,
  emptyMessage = 'No records found',
  emptySubtext = 'Try refining your search or add a new record.',
}) => {
  if (isLoading) {
    return <TableSkeleton rows={6} cols={columns.length || 5} />;
  }

  if (!data || data.length === 0) {
    return emptyState ?? <EmptyState title={emptyMessage} description={emptySubtext} />;
  }

  return (
    <div className="relative w-full overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-sunken/60 text-xs font-medium text-subtle border-b border-line">
            {columns.map((col) => {
              const sorted = col.sortable && sortBy === col.key;
              return (
                <th
                  key={col.key || col.header}
                  scope="col"
                  aria-sort={sorted ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined}
                  className={`py-3 px-4 sm:px-5 whitespace-nowrap ${col.className || ''}`}
                >
                  {col.sortable && onSort ? (
                    <button type="button" onClick={() => onSort(col.key)} className="inline-flex items-center gap-1 hover:text-fg">
                      {col.header}
                      {sorted && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" /> : <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />)}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className="hover:bg-hover transition-colors duration-150">
              {columns.map((col) => (
                <td key={col.key || col.header} className={`py-3.5 px-4 sm:px-5 text-sm text-fg ${col.className || ''}`}>
                  {col.render ? col.render(row, rowIndex) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
