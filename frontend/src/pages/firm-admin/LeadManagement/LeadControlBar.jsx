import React from 'react';
import { Grid3x3, List } from 'lucide-react';
import { SearchBar } from '../../../components/common/SearchBar';

export const LeadControlBar = ({ viewMode, setViewMode, search, setSearch, stageFilter, setStageFilter }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
    <div className="flex items-center gap-2">
      <button
        onClick={() => setViewMode('kanban')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
          viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Grid3x3 size="1em" />
        <span>Visual Pipeline Board</span>
      </button>
      <button
        onClick={() => setViewMode('table')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
          viewMode === 'table' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <List size="1em" />
        <span>Lead Master Table</span>
      </button>
    </div>

    <div className="flex items-center gap-3 w-full sm:w-auto">
      <SearchBar value={search} onChange={setSearch} placeholder="Search lead, company, services..." className="w-full sm:w-64" />
      <select
        value={stageFilter}
        onChange={(e) => setStageFilter(e.target.value)}
        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
      >
        <option value="">All Pipeline Stages</option>
        <option value="NEW_LEAD">New Inquiry</option>
        <option value="DISCUSSION">Discussion</option>
        <option value="PROPOSAL_SENT">Proposal Sent</option>
        <option value="WON">Won & Converted</option>
        <option value="LOST">Lost</option>
      </select>
    </div>
  </div>
);
