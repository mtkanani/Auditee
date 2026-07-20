import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { KanbanBoard } from '../../components/tasks/KanbanBoard';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Modal } from '../../components/common/Modal';
import { FileUpload } from '../../components/common/FileUpload';
import { FiGrid, FiList, FiClock, FiUpload, FiPlus } from 'react-icons/fi';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

export const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Time entry form state
  const [hours, setHours] = useState('');
  const [timeNotes, setTimeNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await userService.getTasks({ search });
      setTasks(res.data || res.tasks || []);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await userService.updateTaskStatus(taskId, newStatus);
      toast.success('Task status updated!');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleLogTime = async (e) => {
    e.preventDefault();
    if (!selectedTask || !hours) return;
    try {
      await userService.logTimeEntry(selectedTask.id, {
        hours: Number(hours),
        notes: timeNotes,
      });
      toast.success('Time entry logged successfully!');
      setHours('');
      setTimeNotes('');
    } catch (error) {
      toast.error('Failed to log time');
    }
  };

  const handleDocumentUpload = async () => {
    if (!selectedTask || !selectedFile) return;
    const formData = new FormData();
    formData.append('document', selectedFile);
    try {
      await userService.uploadTaskDocument(selectedTask.id, formData);
      toast.success('Document uploaded successfully!');
      setSelectedFile(null);
    } catch (error) {
      toast.error('Failed to upload document');
    }
  };

  const columns = [
    {
      header: 'Task Title',
      key: 'title',
      render: (r) => (
        <div>
          <p className="font-bold text-slate-100">{r.title || r.name}</p>
          <p className="text-xs text-slate-400 line-clamp-1">{r.description}</p>
        </div>
      ),
    },
    { header: 'Client', key: 'client', render: (r) => r.client?.clientName || 'N/A' },
    { header: 'Priority', key: 'priority', render: (r) => <PriorityBadge priority={r.priority} /> },
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Actions',
      key: 'actions',
      render: (r) => (
        <button
          onClick={() => {
            setSelectedTask(r);
            setIsTaskModalOpen(true);
          }}
          className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600/30 text-xs font-semibold"
        >
          Manage Task
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Tasks & Assignments"
        subtitle="Manage work orders, log billable hours, and upload compliance documents"
        actions={
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiList className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        }
      />

      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tasks..." />
      </div>

      {viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={tasks}
          onTaskClick={(t) => {
            setSelectedTask(t);
            setIsTaskModalOpen(true);
          }}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <DataTable columns={columns} data={tasks} isLoading={isLoading} />
        </div>
      )}

      {/* Task Details & Actions Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={selectedTask?.title || 'Task Workstation'}
        maxWidth="max-w-2xl"
      >
        {selectedTask && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Current Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedTask.status} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Update Status:</span>
                <select
                  value={selectedTask.status}
                  onChange={(e) => {
                    handleStatusChange(selectedTask.id, e.target.value);
                    setSelectedTask({ ...selectedTask, status: e.target.value });
                  }}
                  className="text-xs bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
            </div>

            <p className="text-sm text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
              {selectedTask.description || 'No additional details provided for this task.'}
            </p>

            {/* Document Upload Section */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <FiUpload className="text-indigo-400" />
                <span>Upload Task Document</span>
              </h4>
              <FileUpload onFileSelect={setSelectedFile} />
              {selectedFile && (
                <button
                  onClick={handleDocumentUpload}
                  className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg"
                >
                  Confirm Document Upload
                </button>
              )}
            </div>

            {/* Time Logging Section */}
            <form onSubmit={handleLogTime} className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <FiClock className="text-purple-400" />
                <span>Log Time Entry</span>
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <input
                    type="number"
                    step="0.5"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="Hours (e.g. 2.5)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={timeNotes}
                    onChange={(e) => setTimeNotes(e.target.value)}
                    placeholder="Work description / notes"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg"
              >
                Submit Time Entry
              </button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};
