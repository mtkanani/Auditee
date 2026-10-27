import React from 'react';
import { Modal } from '../../../components/common/Modal';

export const ConvertToTaskModal = ({
  isTaskModalOpen,
  setIsTaskModalOpen,
  selectedItem,
  handleConvertToTaskSubmit,
  users,
  assignedUserIds,
  setAssignedUserIds,
  convertToTaskMutation,
}) => (
  <Modal
    isOpen={isTaskModalOpen}
    onClose={() => setIsTaskModalOpen(false)}
    title={`⚡ Convert to Active Task: ${selectedItem?.title}`}
  >
    <form onSubmit={handleConvertToTaskSubmit} className="space-y-4">
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
        <p>Category: <strong>{selectedItem?.category}</strong></p>
        <p>Due Date: <strong>{selectedItem?.dueDate ? new Date(selectedItem.dueDate).toLocaleDateString() : ''}</strong></p>
      </div>

      <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
        <label className="block text-xs font-bold text-indigo-400">Select Auditor Employee(s)</label>
        {users.map((u) => (
          <label key={u.id} className="flex items-center gap-2 p-1.5 rounded bg-slate-950 text-xs text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={assignedUserIds.includes(u.id)}
              onChange={() => {
                if (assignedUserIds.includes(u.id)) {
                  setAssignedUserIds(assignedUserIds.filter((id) => id !== u.id));
                } else {
                  setAssignedUserIds([...assignedUserIds, u.id]);
                }
              }}
            />
            <span>{u.firstName} {u.lastName} ({u.designation || 'Staff'})</span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={convertToTaskMutation.isPending}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg mt-2"
      >
        {convertToTaskMutation.isPending ? 'Converting...' : 'Create Task & Assign Auditors'}
      </button>
    </form>
  </Modal>
);
