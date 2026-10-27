import React from 'react';
import { Calendar, List, TriangleAlert, User } from 'lucide-react';

export const LeaveViewTabs = ({
  isAdmin,
  activeTab,
  setActiveTab,
  pendingRequests,
  allFirmRequests,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
    <div className="flex items-center gap-2 flex-wrap">
      {isAdmin && (
        <>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pending' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TriangleAlert size="1em" />
            <span>Pending Inbox ({pendingRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('all_firm')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all_firm' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List size="1em" />
            <span>All Employee Leaves ({allFirmRequests.length})</span>
          </button>
        </>
      )}

      <button
        onClick={() => setActiveTab('my_leaves')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
          activeTab === 'my_leaves' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <User size="1em" />
        <span>My Personal Leaves</span>
      </button>

      <button
        onClick={() => setActiveTab('calendar')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
          activeTab === 'calendar' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Calendar size="1em" />
        <span>Leave Calendar Grid</span>
      </button>
    </div>

    <div className="flex items-center gap-2">
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
          <option key={m} value={m}>
            {new Date(2026, m - 1, 1).toLocaleString('default', { month: 'long' })}
          </option>
        ))}
      </select>

      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
      >
        {[2025, 2026, 2027].map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  </div>
);
