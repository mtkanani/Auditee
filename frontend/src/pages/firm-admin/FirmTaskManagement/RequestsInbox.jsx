import React from 'react';
import { Check, CircleX } from 'lucide-react';
import { EmptyState } from '../../../components/common/EmptyState';

export const RequestsInbox = ({
  clientRequests,
  rejectRequestMutation,
  approveRequestMutation,
  handleRejectRequest,
  setSelectedRequest,
  setRequestAssignmentScope,
  setRequestSelectedUserIds,
  setIsApproveModalOpen,
}) => (
  <div className="space-y-4">
    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
      <strong>Client Work Requests Inbox:</strong> These are audit and filing requests submitted directly by Clients. Accept requests and assign them to single/multiple/all employees below.
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {clientRequests.map((req) => (
        <div key={req.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              REQUESTED BY CLIENT
            </span>
            <span className="text-xs text-slate-400">{new Date(req.createdAt).toLocaleDateString()}</span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-100">{req.title}</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Client: <strong>{req.client?.companyName || req.client?.clientName}</strong> ({req.client?.email})
            </p>
            {req.description && <p className="text-xs text-slate-300 mt-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">{req.description}</p>}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={rejectRequestMutation.isPending || approveRequestMutation.isPending}
              onClick={() => handleRejectRequest(req.id)}
              className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-rose-400 border border-slate-700 hover:border-rose-800 font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CircleX className="w-3.5 h-3.5"  />
              <span>{rejectRequestMutation.isPending && rejectRequestMutation.variables === req.id ? 'Rejecting...' : 'Reject Request'}</span>
            </button>
            <button
              type="button"
              disabled={rejectRequestMutation.isPending || approveRequestMutation.isPending}
              onClick={() => {
                setSelectedRequest(req);
                setRequestAssignmentScope('SINGLE');
                setRequestSelectedUserIds([]);
                setIsApproveModalOpen(true);
              }}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-3.5 h-3.5"  />
              <span>Accept & Assign Auditor</span>
            </button>
          </div>
        </div>
      ))}

      {clientRequests.length === 0 && (
        <div className="col-span-2">
          <EmptyState
            title="No Pending Work Requests"
            description="When clients submit work items from their portal, they will appear here."
          />
        </div>
      )}
    </div>
  </div>
);
