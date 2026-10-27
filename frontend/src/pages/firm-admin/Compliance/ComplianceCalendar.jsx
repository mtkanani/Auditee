import React from 'react';
import { Bell, Calendar, Clock, Zap } from 'lucide-react';
import { CardSkeleton } from '../../../components/common/Skeleton';
import { EmptyState } from '../../../components/common/EmptyState';

export const ComplianceCalendar = ({
  isLoading,
  items,
  handleStatusChange,
  setSelectedItem,
  setIsTaskModalOpen,
  handleSendReminder,
}) => (
  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
      <Calendar size="1em" className="text-indigo-400"  />
      <span>Statutory Compliance Calendar Grid</span>
    </h3>

    {isLoading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    ) : items.length === 0 ? (
      <EmptyState
        title="No statutory compliance items found"
        description="Click 'Generate Deadlines' above to auto-populate Indian tax due dates."
      />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-2.5 shadow-lg group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {item.category}
              </span>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Clock size="1em" /> {new Date(item.dueDate).toLocaleDateString()}
              </span>
            </div>

            <h4 className="text-xs font-extrabold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2">
              {item.title}
            </h4>
            <p className="text-[11px] text-slate-400">
              {item.period || 'Period N/A'} • {item.client?.companyName || item.client?.clientName || 'All Clients'}
            </p>

            {item.penaltyDetails && (
              <p className="text-[10px] text-rose-300 font-semibold p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                ⚠️ {item.penaltyDetails}
              </p>
            )}

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <select
                value={item.status || 'UPCOMING'}
                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                className="text-[10px] bg-slate-900 border border-slate-800 rounded-md px-2 py-1 text-slate-200 font-bold"
              >
                <option value="UPCOMING">UPCOMING</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="FILED">FILED</option>
                <option value="OVERDUE">OVERDUE</option>
              </select>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setIsTaskModalOpen(true);
                  }}
                  className="py-1 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1"
                >
                  <Zap size="1em" />
                  <span>Convert Task</span>
                </button>

                <button
                  onClick={() => handleSendReminder(item)}
                  className="p-1 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                  title="Send Reminder"
                >
                  <Bell className="w-3.5 h-3.5"  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
