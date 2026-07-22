import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { KanbanBoard } from '../../components/tasks/KanbanBoard';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';
import { FiGrid, FiList, FiClock, FiCheckSquare } from 'react-icons/fi';
import { userService } from '../../services/userService';
import { taskService } from '../../services/taskService';
import toast from 'react-hot-toast';

export const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [search, setSearch] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

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

  const columns = [
    {
      header: 'Task Title',
      key: 'title',
      render: (r) => (
        <div
          onClick={() => {
            setSelectedTaskId(r.id);
            setIsTaskModalOpen(true);
          }}
          className="cursor-pointer group"
        >
          <p className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{r.title || r.name}</p>
          <p className="text-xs text-slate-400 line-clamp-1">{r.description}</p>
        </div>
      ),
    },
    { header: 'Client', key: 'client', render: (r) => r.client?.companyName || r.client?.clientName || 'Firm Task' },
    { header: 'Priority', key: 'priority', render: (r) => <PriorityBadge priority={r.priority} /> },
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Actions',
      key: 'actions',
      render: (r) => (
        <button
          onClick={() => {
            setSelectedTaskId(r.id);
            setIsTaskModalOpen(true);
          }}
          className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600/30 text-xs font-semibold"
        >
          Manage Task Hub
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Assigned Tasks & Checklist"
        subtitle="Complete subtasks, collaborate on comments, attach files, and update task status"
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
        <SearchBar value={search} onChange={setSearch} placeholder="Search assigned tasks..." />
      </div>

      {viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={tasks}
          onTaskClick={(t) => {
            setSelectedTaskId(t.id);
            setIsTaskModalOpen(true);
          }}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <DataTable columns={columns} data={tasks} isLoading={isLoading} />
        </div>
      )}

      {/* 360-Degree Task Detail Hub Modal */}
      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onRefresh={fetchTasks}
      />
    </div>
  );
};
