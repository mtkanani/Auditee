import React from 'react';
import { TriangleAlert } from 'lucide-react';
import { DataTable } from '../../../components/common/DataTable';

export const PendingInbox = ({ pendingRequests, adminRemarks, setAdminRemarks, handleAdminReview, columns, isLoading }) => (
  <div className="space-y-6">
    {pendingRequests.length > 0 && (
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-purple-950/40 to-slate-900 border border-amber-500/30 space-y-3 shadow-xl">
        <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <TriangleAlert size="1em" /> Pending Employee Applications ({pendingRequests.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pendingRequests.map((p) => (
            <div key={p.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="font-extrabold text-slate-100 text-xs">
                  {p.user?.firstName} {p.user?.lastName} ({p.user?.designation || 'Staff Auditor'})
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {p.leaveType.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs text-amber-300 font-bold">
                📅 {new Date(p.startDate).toLocaleDateString()} to {new Date(p.endDate).toLocaleDateString()} ({p.totalDays} Days)
              </p>
              <p className="text-xs text-slate-300"><strong>Reason:</strong> {p.reason}</p>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Admin remarks (optional)..."
                  value={adminRemarks[p.id] || ''}
                  onChange={(e) => setAdminRemarks({ ...adminRemarks, [p.id]: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100"
                />
                <button
                  onClick={() => handleAdminReview(p.id, 'APPROVED')}
                  className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap shadow cursor-pointer"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAdminReview(p.id, 'REJECTED')}
                  className="py-1.5 px-3 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/20 font-bold text-xs cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <DataTable columns={columns} data={pendingRequests} isLoading={isLoading} />
    </div>
  </div>
);
