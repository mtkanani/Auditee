import React from 'react';
import { Layers, Search } from 'lucide-react';

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
  const displayData = paginatedData.length > 0 || (count === 0 && paginatedData.length === 0)
    ? paginatedData
    : data;

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-md">
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {headerActions}

          {onRowsPerPageChange && rowsPerPage && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span>Show</span>
              <select
                value={rowsPerPage}
                onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                className="py-1 px-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value={10}>10 rows</option>
                <option value={25}>25 rows</option>
                <option value={50}>50 rows</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {data.length > 0 &&
                Object.keys(data[0]).map((key) => (
                  <th key={key} className="py-3.5 px-4 whitespace-nowrap">
                    {formatHeader ? key.replace(/([A-Z])/g, ' $1').toUpperCase() : key}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-xs font-medium text-slate-300">
            {displayData.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-16 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 text-slate-600" />
                    <p className="text-slate-400 font-semibold">No records found</p>
                    <p className="text-slate-600 text-xs">Try adjusting your filters or date range</p>
                  </div>
                </td>
              </tr>
            ) : (
              displayData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  {Object.entries(row).map(([k, val], cIdx) => (
                    <td key={cIdx} className="py-3.5 px-4 whitespace-nowrap">
                      {typeof val === 'number' &&
                      (k.includes('Amount') ||
                        k.includes('Billed') ||
                        k.includes('Revenue') ||
                        k.includes('Balance') ||
                        k.includes('total')) ? (
                        <span className="font-bold text-emerald-400">₹{val.toLocaleString()}</span>
                      ) : k === 'status' || k === 'priority' ? (
                        <span
                          className={`py-1 px-2.5 rounded-full text-[10px] font-bold tracking-wide inline-flex items-center gap-1 ${
                            val === 'COMPLETED' || val === 'ACTIVE' || val === 'PAID'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : val === 'OVERDUE' || val === 'HIGH' || val === 'UNPAID'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {String(val)}
                        </span>
                      ) : (
                        String(val !== null && val !== undefined ? val : 'N/A')
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {showPagination && onPageChange && count > 0 && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>
            Showing page {currentPage} of {totalPages} ({count} total entries)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="py-1 px-3 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="py-1 px-3 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
