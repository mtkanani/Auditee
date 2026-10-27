import React from 'react';
import { Inbox } from 'lucide-react';
import { SearchBar } from '../../../components/common/SearchBar';

export const TaskViewTabs = ({ activeTab, setActiveTab, clientRequests, search, setSearch, statusFilter, setStatusFilter }) => (
  <div className="flex items-center justify-between gap-4 p-2 rounded-2xl bg-slate-900/60 border border-slate-800">
    <div className="flex items-center gap-2">
      <button
        onClick={() => setActiveTab('kanban')}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
          activeTab === 'kanban'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        Kanban Board View
      </button>

      <button
        onClick={() => setActiveTab('table')}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
          activeTab === 'table'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        Detailed List View
      </button>

      <button
        onClick={() => setActiveTab('requests')}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
          activeTab === 'requests'
            ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Inbox size="1em" />
        <span>Client Work Requests ({clientRequests.length})</span>
      </button>
    </div>

    {/* Filter Controls */}
    <div className="flex items-center gap-3">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search tasks..."
        className="w-48 sm:w-64"
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
      >
        <option value="">All Statuses</option>
        <option value="PENDING">PENDING</option>
        <option value="IN_PROGRESS">IN PROGRESS</option>
        <option value="UNDER_REVIEW">UNDER REVIEW</option>
        <option value="COMPLETED">COMPLETED</option>
      </select>
    </div>
  </div>
);
