import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { FiPlus, FiTrash2, FiUsers, FiUser, FiGlobe } from 'react-icons/fi';
import { firmAdminService } from '../../services/firmAdminService';
import { taskService } from '../../services/taskService';
import toast from 'react-hot-toast';

export const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [assignmentScope, setAssignmentScope] = useState('SINGLE'); // 'SINGLE' | 'MULTIPLE' | 'ALL'
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      firmAdminService.getClients({ limit: 100 }).then((res) => setClients(res.data || res.clients || []));
      firmAdminService.getUsers({ limit: 100 }).then((res) => setUsers(res.data || res.users || []));
    }
  }, [isOpen]);

  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) return;
    setSubtasks([...subtasks, subtaskInput.trim()]);
    setSubtaskInput('');
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleUserToggle = (uId) => {
    if (selectedUserIds.includes(uId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== uId));
    } else {
      setSelectedUserIds([...selectedUserIds, uId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }

    if (assignmentScope === 'SINGLE' && selectedUserIds.length === 0) {
      toast.error('Please select an employee for task assignment');
      return;
    }

    if (assignmentScope === 'MULTIPLE' && selectedUserIds.length === 0) {
      toast.error('Please select at least one employee for team assignment');
      return;
    }

    try {
      await taskService.createTask({
        title: title.trim(),
        description: description.trim(),
        clientId: clientId ? parseInt(clientId, 10) : null,
        priority,
        dueDate: dueDate || null,
        assignmentScope,
        assignedUserIds: selectedUserIds,
        subtasks,
      });

      toast.success('Task created and assigned successfully!');
      onClose();
      if (onTaskCreated) onTaskCreated();
      // Reset form
      setTitle('');
      setDescription('');
      setClientId('');
      setPriority('MEDIUM');
      setDueDate('');
      setAssignmentScope('SINGLE');
      setSelectedUserIds([]);
      setSubtasks([]);
    } catch (err) {
      toast.error(err.message || 'Failed to create task');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create & Assign New Task">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Monthly GST Return GSTR-3B Filing"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Client & Priority */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Client (Optional)</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            >
              <option value="">Direct Firm Task (No Client)</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName || c.clientName} ({c.gstNumber || 'N/A'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>
        </div>

        {/* Assignment Scope selector */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Assignment Mode
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setAssignmentScope('SINGLE');
                setSelectedUserIds(selectedUserIds.slice(0, 1));
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                assignmentScope === 'SINGLE'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiUser className="w-4 h-4" />
              <span>Single Auditor</span>
            </button>

            <button
              type="button"
              onClick={() => setAssignmentScope('MULTIPLE')}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                assignmentScope === 'MULTIPLE'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiUsers className="w-4 h-4" />
              <span>Multiple / Team</span>
            </button>

            <button
              type="button"
              onClick={() => setAssignmentScope('ALL')}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                assignmentScope === 'ALL'
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiGlobe className="w-4 h-4" />
              <span>ALL Employees</span>
            </button>
          </div>

          {/* User selector based on assignment mode */}
          {assignmentScope === 'SINGLE' && (
            <select
              value={selectedUserIds[0] || ''}
              onChange={(e) => setSelectedUserIds(e.target.value ? [parseInt(e.target.value, 10)] : [])}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
            >
              <option value="">Select Auditor Employee...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} ({u.designation || 'Staff'})
                </option>
              ))}
            </select>
          )}

          {assignmentScope === 'MULTIPLE' && (
            <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
              <span className="text-[10px] text-slate-400">Select employees for this task team:</span>
              {users.map((u) => (
                <label key={u.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800/60 cursor-pointer text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(u.id)}
                    onChange={() => handleUserToggle(u.id)}
                    className="rounded border-slate-800 bg-slate-950 text-purple-600 focus:ring-purple-500"
                  />
                  <span>{u.firstName} {u.lastName}</span>
                  <span className="text-[10px] text-slate-500">({u.designation || 'Staff'})</span>
                </label>
              ))}
            </div>
          )}

          {assignmentScope === 'ALL' && (
            <p className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
              ⚡ Broad-broadcast: This task will be assigned to ALL active employees in the firm.
            </p>
          )}
        </div>

        {/* Due Date & Description */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Task Scope Description</label>
            <input
              type="text"
              placeholder="Brief instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            />
          </div>
        </div>

        {/* Subtask Checklist Adder */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
            Subtask Checklist Items
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add checklist item (e.g. Check Purchase Register)..."
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
            >
              Add
            </button>
          </div>

          <div className="space-y-1">
            {subtasks.map((st, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-xs text-slate-200">
                <span>{i + 1}. {st}</span>
                <button type="button" onClick={() => handleRemoveSubtask(i)} className="text-rose-400 hover:text-rose-300">
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg mt-4"
        >
          Create & Assign Task
        </button>
      </form>
    </Modal>
  );
};
