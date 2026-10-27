import React from 'react';
import { Calendar, List } from 'lucide-react';
import { SearchBar } from '../../../components/common/SearchBar';

export const ComplianceFilters = ({
  viewMode,
  setViewMode,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
}) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
    <div className="flex items-center gap-2">
      <button
        onClick={() => setViewMode('calendar')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
          viewMode === 'calendar' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Calendar size="1em" />
        <span>Compliance Calendar</span>
      </button>

      <button
        onClick={() => setViewMode('table')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
          viewMode === 'table' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <List size="1em" />
        <span>Master List View</span>
      </button>
    </div>

    <div className="flex items-center gap-3 w-full sm:w-auto">
      <SearchBar value={search} onChange={setSearch} placeholder="Search filing name, period..." className="w-full sm:w-48" />

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
      >
        <option value="">All Categories</option>
        <option value="GST">GST Returns</option>
        <option value="INCOME_TAX">Income Tax & Audit</option>
        <option value="TDS">TDS Returns</option>
        <option value="ROC_MCA">ROC / MCA</option>
        <option value="PF_ESI">PF & ESI</option>
        <option value="AUDIT">Audit Schedules</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
      >
        <option value="">All Statuses</option>
        <option value="UPCOMING">UPCOMING</option>
        <option value="IN_PROGRESS">IN PROGRESS</option>
        <option value="FILED">FILED</option>
        <option value="OVERDUE">OVERDUE</option>
      </select>
    </div>
  </div>
);
