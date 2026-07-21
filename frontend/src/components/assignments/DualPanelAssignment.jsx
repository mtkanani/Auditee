import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUserCheck,
  FiPlus,
  FiTrash2,
  FiUser,
  FiBriefcase,
  FiCheckCircle,
  FiCheckSquare,
  FiX,
  FiClock,
  FiLayers,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export const DualPanelAssignment = ({
  clients = [],
  users = [],
  assignments = [],
  tasks = [],
  onAssign,
  onUnassign,
  onCreateTask,
  isLoading = false,
}) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchClient, setSearchClient] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [activeTab, setActiveTab] = useState('assignments'); // 'assignments' | 'tasks'

  // Task Modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    clientId: '',
  });
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const filteredClients = clients.filter(
    (c) =>
      c.clientName?.toLowerCase().includes(searchClient.toLowerCase()) ||
      c.companyName?.toLowerCase().includes(searchClient.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

  const handleAssignClick = async () => {
    if (!selectedClient || !selectedUser) return;
    await onAssign(selectedUser.id, selectedClient.id);
    setSelectedClient(null);
    setSelectedUser(null);
  };

  const handleOpenTaskModal = () => {
    if (!selectedUser) {
      toast.error('Please select an employee user first to assign a task');
      return;
    }
    setTaskForm({
      title: '',
      description: '',
      priority: 'MEDIUM',
      dueDate: '',
      clientId: selectedClient ? String(selectedClient.id) : '',
    });
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    if (!selectedUser) return;

    setIsSubmittingTask(true);
    try {
      await onCreateTask({
        userId: selectedUser.id,
        clientId: taskForm.clientId ? parseInt(taskForm.clientId, 10) : null,
        title: taskForm.title.trim(),
        description: taskForm.description.trim(),
        priority: taskForm.priority,
        dueDate: taskForm.dueDate || null,
      });
      setIsTaskModalOpen(false);
      setSelectedUser(null);
      setSelectedClient(null);
    } catch (err) {
      // Error handled in parent toast
    } finally {
      setIsSubmittingTask(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Dual Panel Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Left Panel: Clients List (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              <FiBriefcase className="text-indigo-400" />
              <span>Select Client (Optional)</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
              {filteredClients.length}
            </span>
          </div>

          <input
            type="text"
            placeholder="Filter clients..."
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
            className="my-3 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredClients.map((client) => {
              const isSelected = selectedClient?.id === client.id;
              const assignedCount = assignments.filter((a) => a.clientId === client.id).length;

              return (
                <motion.div
                  key={client.id}
                  whileHover={{ x: 3 }}
                  onClick={() => setSelectedClient(isSelected ? null : client)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">{client.clientName}</h4>
                    <p className="text-xs text-slate-400">{client.companyName || client.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {assignedCount} Users
                    </span>
                    {isSelected && <FiCheckCircle className="w-4 h-4 text-indigo-400" />}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Employee Users List (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              <FiUser className="text-purple-400" />
              <span>Select Employee User (Required)</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
              {filteredUsers.length}
            </span>
          </div>

          <input
            type="text"
            placeholder="Filter employee users..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="my-3 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredUsers.map((user) => {
              const isSelected = selectedUser?.id === user.id;

              return (
                <motion.div
                  key={user.id}
                  whileHover={{ x: 3 }}
                  onClick={() => setSelectedUser(isSelected ? null : user)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-600/15 border-purple-500 shadow-lg shadow-purple-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">
                      {user.firstName} {user.lastName}
                    </h4>
                    <p className="text-xs text-slate-400">{user.designation || user.email}</p>
                  </div>
                  {isSelected && <FiCheckCircle className="w-4 h-4 text-purple-400" />}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action Column (1 Col) */}
        <div className="lg:col-span-1 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-center items-center text-center space-y-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FiUserCheck className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-200">Workstation Actions</h4>
            <p className="text-xs text-slate-400 mt-1">Pair client-user or assign direct tasks.</p>
          </div>

          {/* Action 1: Pair Client & User */}
          <button
            onClick={handleAssignClick}
            disabled={!selectedClient || !selectedUser || isLoading}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
            title="Requires both 1 Client and 1 Employee selected"
          >
            <FiPlus className="w-4 h-4" />
            <span>Pair Client</span>
          </button>

          {/* Action 2: Assign Direct Task */}
          <button
            onClick={handleOpenTaskModal}
            disabled={!selectedUser || isLoading}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold text-xs border border-purple-500/30 hover:border-purple-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
            title="Assign a direct task to the selected employee (Client optional)"
          >
            <FiCheckSquare className="w-4 h-4 text-purple-400" />
            <span>Direct Task</span>
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'assignments'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiLayers />
              <span>Client-User Pairs ({assignments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'tasks'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiCheckSquare />
              <span>Assigned Firm Tasks ({tasks.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Client Assignments Table */}
        {activeTab === 'assignments' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Assigned Employee</th>
                  <th className="py-3 px-4">Role / Designation</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {assignments.map((item) => (
                  <tr key={`${item.clientId}-${item.userId}`} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {item.client?.clientName || item.clientId}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {item.user ? `${item.user.firstName} ${item.user.lastName}` : item.userId}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {item.user?.designation || 'CA Staff'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onUnassign(item.userId, item.clientId)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 transition-colors"
                        title="Remove Assignment"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {assignments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-slate-500">
                      No client-user assignments created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Tasks Table */}
        {activeTab === 'tasks' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Task Title</th>
                  <th className="py-3 px-4">Assigned User</th>
                  <th className="py-3 px-4">Client Scope</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {task.title}
                      {task.description && (
                        <p className="text-xs text-slate-400 font-normal line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {task.user ? `${task.user.firstName} ${task.user.lastName}` : 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {task.client ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                          {task.client.clientName}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                          Direct Task
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold">
                      <span
                        className={`px-2 py-0.5 rounded-md ${
                          task.priority === 'URGENT'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : task.priority === 'HIGH'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs text-slate-400">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                    </td>
                  </tr>
                ))}

                {tasks.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-slate-500">
                      No firm tasks created yet. Use the "Direct Task" button above to assign tasks!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Direct Task Modal */}
      <AnimatePresence>
        {isTaskModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <FiCheckSquare className="text-purple-400" />
                  <span>Assign Direct Task</span>
                </h3>
                <button
                  onClick={() => setIsTaskModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
