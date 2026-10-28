import React from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../lib/cn';
import { EmptyState } from '../common/EmptyState';

const align = { left: 'text-left', right: 'text-right', center: 'text-center' };
const cellValue = (col, row) => (col.render ? col.render(row) : row[col.key]);

/**
 * Data table with the same columns API as common/DataTable:
 * columns: [{ key, header, render?, sortable?, align?, className?, hideOnMobile? }].
 * Below the sm breakpoint rows become stacked cards (first column is the card title).
 * footer: e.g. <Pagination />.
 */
export const Table = ({
  columns,
  data = [],
  isLoading = false,
  emptyState,
  onRowClick,
  rowKey = 'id',
  sortBy,
  sortOrder,
  onSort,
  footer,
  className,
}) => {
  const keyOf = (row, i) => row[rowKey] ?? i;
  const [first, ...rest] = columns;

  const body = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-t border-line">
          {columns.map((col) => (
            <td key={col.key || col.header} className="px-5 py-4">
              <div className="h-3.5 rounded-full bg-hover animate-pulse" style={{ width: `${45 + ((i * 17) % 40)}%` }} />
            </td>
          ))}
        </tr>
      ));
    }
    return data.map((row, i) => (
      <tr
        key={keyOf(row, i)}
        onClick={onRowClick ? () => onRowClick(row) : undefined}
        className={cn('border-t border-line transition-colors', onRowClick ? 'cursor-pointer hover:bg-hover' : 'hover:bg-hover/50')}
      >
        {columns.map((col) => (
          <td key={col.key || col.header} className={cn('px-5 py-3.5 text-sm text-fg', align[col.align || 'left'], col.className)}>
            {cellValue(col, row)}
          </td>
        ))}
      </tr>
    ));
  };

  const empty = !isLoading && data.length === 0;

  return (
    <div className={cn('rounded-2xl bg-surface border border-line shadow-card overflow-hidden', className)}>
      {/* Desktop / tablet */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-sunken/60">
            <tr>
              {columns.map((col) => {
                const sorted = sortBy === col.key;
                return (
                  <th
                    key={col.key || col.header}
                    scope="col"
                    aria-sort={sorted ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined}
                    className={cn('px-5 py-3 text-xs font-medium text-muted whitespace-nowrap', align[col.align || 'left'])}
                  >
                    {col.sortable && onSort ? (
                      <button
                        type="button"
                        onClick={() => onSort(col.key)}
                        className="inline-flex items-center gap-1 hover:text-fg focus-visible:outline-none focus-visible:text-fg"
                      >
                        {col.header}
                        {sorted ? (
                          sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" /> : <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          {!empty && <tbody>{body()}</tbody>}
        </table>
      </div>

      {/* Mobile: stacked cards */}
      {!empty && (
        <ul className="sm:hidden divide-y divide-line">
          {(isLoading ? Array.from({ length: 4 }) : data).map((row, i) => (
            <li
              key={isLoading ? i : keyOf(row, i)}
              onClick={!isLoading && onRowClick ? () => onRowClick(row) : undefined}
              className={cn('p-4 space-y-2', onRowClick && 'active:bg-hover')}
            >
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-4 w-2/3 rounded-full bg-hover animate-pulse" />
                  <div className="h-3 w-1/2 rounded-full bg-hover animate-pulse" />
                </div>
              ) : (
                <>
                  <div className="text-sm font-medium text-fg">{cellValue(first, row)}</div>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                    {rest.filter((c) => !c.hideOnMobile).map((col) => (
                      <React.Fragment key={col.key || col.header}>
                        <dt className="text-subtle">{col.header}</dt>
                        <dd className="text-fg text-right min-w-0">{cellValue(col, row)}</dd>
                      </React.Fragment>
                    ))}
                  </dl>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {empty && (emptyState ?? <EmptyState title="Nothing here yet" description="Try a different search or filter." />)}
      {footer && <div className="border-t border-line">{footer}</div>}
    </div>
  );
};
