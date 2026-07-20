import React from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

export const DataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  sortBy,
  sortOrder,
  onSort,
  emptyMessage = 'No records found',
  emptySubtext = 'Try refining your search or add a new record.',
}) => {
  if (isLoading) {
    return (
      <div className="w-full p-4 space-y-3">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyMessage} description={emptySubtext} />;
  }

  return (
    <div className="w-full overflow-x-auto rounded-t-2xl">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/90 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800 tracking-wider">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key || col.header}
                onClick={() => col.sortable && onSort && onSort(col.key)}
                className={`py-3.5 px-4 sm:px-6 ${
                  col.sortable ? 'cursor-pointer select-none hover:text-indigo-400' : ''
                } ${col.className || ''}`}
              >
                <div className="flex items-center gap-1.5">
                  <span>{col.header}</span>
                  {col.sortable && sortBy === col.key && (
                    <span>
                      {sortOrder === 'asc' ? (
                        <FiChevronUp className="w-3.5 h-3.5 text-indigo-400" />
                      ) : (
                        <FiChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className="hover:bg-slate-800/40 transition-colors duration-150 group"
            >
              {columns.map((col) => (
                <td key={col.key || col.header} className={`py-4 px-4 sm:px-6 text-sm ${col.className || ''}`}>
                  {col.render ? col.render(row, rowIndex) : row[col.key] ?? 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
