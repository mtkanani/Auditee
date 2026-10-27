import React from 'react';
import { Modal } from '../../../components/common/Modal';

export const ApproveRequestModal = ({
  isApproveModalOpen,
  setIsApproveModalOpen,
  selectedRequest,
  handleApproveRequestSubmit,
  requestAssignmentScope,
  setRequestAssignmentScope,
  requestSelectedUserIds,
  setRequestSelectedUserIds,
  users,
  approveRequestMutation,
}) => (
  <Modal
    isOpen={isApproveModalOpen}
    onClose={() => setIsApproveModalOpen(false)}
    title={`Accept & Assign: ${selectedRequest?.title}`}
  >
    <form onSubmit={handleApproveRequestSubmit} className="space-y-4">
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
        Client: <strong>{selectedRequest?.client?.companyName || selectedRequest?.client?.clientName}</strong>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-indigo-400">Select Assignment Mode</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setRequestAssignmentScope('SINGLE')}
            className={`p-2 rounded-xl border text-xs font-bold ${
              requestAssignmentScope === 'SINGLE' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            Single Auditor
          </button>
          <button
            type="button"
            onClick={() => setRequestAssignmentScope('MULTIPLE')}
            className={`p-2 rounded-xl border text-xs font-bold ${
              requestAssignmentScope === 'MULTIPLE' ? 'bg-purple-600/20 border-purple-500 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            Team Group
          </button>
          <button
            type="button"
            onClick={() => setRequestAssignmentScope('ALL')}
            className={`p-2 rounded-xl border text-xs font-bold ${
              requestAssignmentScope === 'ALL' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            ALL Employees
          </button>
        </div>

        {requestAssignmentScope === 'SINGLE' && (
          <select
            value={requestSelectedUserIds[0] || ''}
            onChange={(e) => setRequestSelectedUserIds(e.target.value ? [parseInt(e.target.value, 10)] : [])}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          >
            <option value="">Select Auditor Employee...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.firstName} {u.lastName} ({u.designation || 'Staff'})
              </option>
            ))}
          </select>
        )}

        {requestAssignmentScope === 'MULTIPLE' && (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {users.map((u) => (
              <label key={u.id} className="flex items-center gap-2 p-1.5 rounded bg-slate-950 text-xs text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requestSelectedUserIds.includes(u.id)}
                  onChange={() => {
                    if (requestSelectedUserIds.includes(u.id)) {
                      setRequestSelectedUserIds(requestSelectedUserIds.filter((id) => id !== u.id));
                    } else {
                      setRequestSelectedUserIds([...requestSelectedUserIds, u.id]);
                    }
                  }}
                />
                <span>{u.firstName} {u.lastName}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={approveRequestMutation.isPending}
        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {approveRequestMutation.isPending ? 'Accepting & Assigning...' : 'Confirm & Assign Task'}
      </button>
    </form>
  </Modal>
);
