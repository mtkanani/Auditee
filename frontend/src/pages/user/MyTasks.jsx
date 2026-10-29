import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { KanbanBoard } from '../../components/tasks/KanbanBoard';
import { PriorityBadge } from '../../components/tasks/PriorityBadge';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';
import { EmptyState } from '../../components/common/EmptyState';
import { FilterBar, PageHeader, SearchInput, StatusTag, Table, Tabs } from '../../components/ui';
import { Columns3, List, ListTodo } from 'lucide-react';
import { useMyTasks, useUpdateTaskStatus } from '../../queries/useTasks';
import toast from 'react-hot-toast';

const VIEWS = [
  { value: 'kanban', label: 'Board', icon: Columns3 },
  { value: 'table', label: 'List', icon: List },
];

export const MyTasks = () => {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [search, setSearch] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const { tasks, isLoading, error } = useMyTasks({ search: debouncedSearch || undefined });
  const updateStatusMutation = useUpdateTaskStatus({ scope: 'user' });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load tasks');
    }
  }, [error]);

  const handleStatusChange = (taskId, newStatus) => {
    updateStatusMutation.mutate({ taskId, status: newStatus });
  };

  const openTask = (task) => {
    setSelectedTaskId(task.id);
    setIsTaskModalOpen(true);
  };

  const columns = [
    {
      header: 'Task',
      key: 'title',
      render: (r) => (
        <div className="min-w-0">
          <p className="font-medium text-fg truncate">{r.title || r.name}</p>
          {r.description && <p className="text-xs text-muted line-clamp-1 mt-0.5">{r.description}</p>}
        </div>
      ),
    },
    {
      header: 'Client',
      key: 'client',
      render: (r) => <span className="text-muted">{r.client?.companyName || r.client?.clientName || 'Firm task'}</span>,
    },
    { header: 'Priority', key: 'priority', render: (r) => <PriorityBadge priority={r.priority} /> },
    { header: 'Status', key: 'status', render: (r) => (r.status ? <StatusTag status={String(r.status).toUpperCase()} /> : '—') },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My tasks"
        description="Work through checklists, comment, attach files and move tasks along."
        actions={<Tabs items={VIEWS} value={viewMode} onChange={setViewMode} aria-label="Task view" />}
      />

      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search my tasks" />
      </FilterBar>

      {viewMode === 'kanban' ? (
        <KanbanBoard tasks={tasks} onTaskClick={openTask} onStatusChange={handleStatusChange} />
      ) : (
        <Table
          columns={columns}
          data={tasks}
          isLoading={isLoading}
          onRowClick={openTask}
          emptyState={
            <EmptyState
              icon={ListTodo}
              title={search ? 'No tasks match your search' : 'No tasks assigned yet'}
              description={search ? 'Try a different word.' : 'Tasks your firm assigns to you will show up here.'}
            />
          }
        />
      )}

      <TaskDetailModal taskId={selectedTaskId} isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
    </div>
  );
};
