import React from 'react';
import { Search, X, RefreshCw } from 'lucide-react';
import { DATE_RANGE_PILLS } from './constants';

export const ReportFilters = ({
  dateRange,
  onDateRangeChange,
  selectedEmployee,
  onEmployeeChange,
  employees = [],
  selectedClient,
  onClientChange,
  clients = [],
  searchQuery,
  onSearchChange,
  onReset,
  onApply,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Quick Date Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
          {DATE_RANGE_PILLS.map((pill) => (
            <button
              key={pill.id}
              onClick={() => onDateRangeChange(pill.id)}
              className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                dateRange === pill.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Employee Filter */}
        <select
          value={selectedEmployee}
          onChange={(e) => onEmployeeChange(e.target.value)}
          className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Staff</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
        </select>

        {/* Client Filter */}
        <select
          value={selectedClient}
          onChange={(e) => onClientChange(e.target.value)}
          className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Clients</option>
          {clients.map((cli) => (
            <option key={cli.id} value={cli.id}>
              {cli.clientName || cli.companyName}
            </option>
          ))}
        </select>

        {/* Search Input */}
        <div className="relative min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onApply()}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button
          onClick={onApply}
          className="py-2 px-4 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Apply Filters</span>
        </button>
      </div>
    </div>
  );
};
