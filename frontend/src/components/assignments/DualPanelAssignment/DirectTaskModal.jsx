import React from 'react';
import { SquareCheckBig } from 'lucide-react';
import { Modal } from '../../common/Modal';

export const DirectTaskModal = ({
  isTaskModalOpen,
  setIsTaskModalOpen,
  selectedUser,
  handleTaskSubmit,
  taskForm,
  setTaskForm,
  clients,
  isSubmittingTask,
}) => (
  <Modal
    isOpen={Boolean(isTaskModalOpen && selectedUser)}
    onClose={() => setIsTaskModalOpen(false)}
    title={
      <span className="flex items-center gap-2">
        <SquareCheckBig size="1em" className="text-purple-400" />
        <span>Assign Direct Task</span>
      </span>
    }
    maxWidth="max-w-lg"
  >
    {selectedUser && (
      <form onSubmit={handleTaskSubmit} className="space-y-4">
        {/* Pre-selected Employee */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Assigned Employee (User)
          </label>
          <input
            type="text"
            disabled
            value={`${selectedUser.firstName} ${selectedUser.lastName} (${selectedUser.email})`}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-purple-300 font-semibold cursor-not-allowed opacity-80"
          />
        </div>

        {/* Optional Client Scope */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Client Scope (Optional)
          </label>
          <select
            value={taskForm.clientId}
            onChange={(e) => setTaskForm({ ...taskForm, clientId: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="">-- No Client (Direct Internal Firm Task) --</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.clientName} ({c.companyName || c.email})
              </option>
            ))}
          </select>
        </div>

        {/* Task Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Task Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Audit Document Verification / GST Reconciliation"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Task Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Task Description
          </label>
          <textarea
            rows={3}
            placeholder="Detailed work notes or audit guidelines for the employee..."
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        {/* Priority & Due Date Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Priority
            </label>
            <select
              value={taskForm.priority}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setIsTaskModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmittingTask}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-500/25 disabled:opacity-50 transition-all"
          >
            {isSubmittingTask ? 'Creating...' : 'Assign Task'}
          </button>
        </div>
      </form>
    )}
  </Modal>
);
