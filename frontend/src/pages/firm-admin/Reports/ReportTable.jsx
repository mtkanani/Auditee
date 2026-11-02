import React from 'react';
import { Layers, SearchX } from 'lucide-react';
import { Pagination } from '../../../components/common/Pagination';
import { StatusTag } from '../../../components/ui';
import { PriorityBadge } from '../../../components/tasks/PriorityBadge';

const isMoney = (k) => ['Amount', 'Billed', 'Revenue', 'Balance', 'total'].some((w) => k.includes(w));
const headerLabel = (key) => {
  const words = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1).toLowerCase();
};

const Cell = ({ k, val }) => {
  if (typeof val === 'number' && isMoney(k)) return <span className="font-medium text-fg tabular-nums">₹{val.toLocaleString('en-IN')}</span>;
  if (k === 'priority' && val) return <PriorityBadge priority={val} />;
  if (k === 'status' && val) return <StatusTag status={String(val).toUpperCase()} />;
  if (val === null || val === undefined || val === '') return <span className="text-subtle">—</span>;
  return <span className={typeof val === 'number' ? 'tabular-nums' : undefined}>{String(val)}</span>;
};

/** Generic table for report rows. Columns come from the keys of the first row. */
export const ReportTable = ({
  title,
  subtitle,
  icon: Icon = Layers,
  data = [],
  paginatedData = [],
  totalEntries,
  rowsPerPage,
  onRowsPerPageChange,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  headerActions,
  formatHeader = true,
  showPagination = true,
}) => {
  const count = totalEntries !== undefined ? totalEntries : data.length;
  const displayData = paginatedData.length > 0 || (count === 0 && paginatedData.length === 0) ? paginatedData : data;
  const keys = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <section className="rounded-2xl border border-line bg-surface shadow-card overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-accent-soft text-accent-fg shrink-0">
            <Icon className="w-4 h-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-fg">{title}</h3>
            {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
          </div>
        </div>
        {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          {keys.length > 0 && (
            <thead>
              <tr className="bg-sunken/60 text-xs font-medium text-subtle">
                {keys.map((key) => (
                  <th key={key} scope="col" className="py-3 px-4 whitespace-nowrap">
                    {formatHeader ? headerLabel(key) : key}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-line text-muted">
            {displayData.length === 0 ? (
              <tr>
                <td colSpan={keys.length || 1} className="py-16">
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <SearchX className="w-6 h-6 text-subtle" aria-hidden="true" />
                    <p className="text-sm font-medium text-fg">No records found</p>
                    <p className="text-xs text-muted">Try a different date range or filter.</p>
                  </div>
                </td>
              </tr>
            ) : (
              displayData.map((row, idx) => (
                <tr key={idx} className="hover:bg-hover transition-colors">
                  {Object.entries(row).map(([k, val]) => (
                    <td key={k} className="py-3 px-4 whitespace-nowrap">
                      <Cell k={k} val={val} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && onPageChange && count > 0 && (
        <div className="border-t border-line">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={count}
            limit={rowsPerPage || 10}
            onPageChange={onPageChange}
            onLimitChange={onRowsPerPageChange}
          />
        </div>
      )}
    </section>
  );
};
