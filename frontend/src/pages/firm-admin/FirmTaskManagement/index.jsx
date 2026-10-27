import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable } from '../../../components/common/DataTable';
import { Pagination } from '../../../components/common/Pagination';
import { TaskDetailModal } from '../../../components/tasks/TaskDetailModal';
import { CreateTaskModal } from '../../../components/tasks/CreateTaskModal';
import { TaskTemplatesModal } from '../../../components/tasks/TaskTemplatesModal';
import { Plus, Zap } from 'lucide-react';
import { useFirmTaskManagement } from './useFirmTaskManagement';
import { getTaskColumns } from './taskColumns';
import { TaskStats } from './TaskStats';
import { TaskViewTabs } from './TaskViewTabs';
import { KanbanView } from './KanbanView';
import { RequestsInbox } from './RequestsInbox';
import { ApproveRequestModal } from './ApproveRequestModal';

export const FirmTaskManagement = () => {
  const view = useFirmTaskManagement();
  const {
    activeTab,
    page,
    setPage,
    tasks,
    isLoading,
    totalPages,
    totalRecords,
    selectedTaskId,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isTemplatesModalOpen,
    setIsTemplatesModalOpen,
  } = view;

  const columns = getTaskColumns(view);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task & Audit Workstation"
        subtitle="Assign tasks to Single, Multiple, or ALL Employees, approve Client Work Requests, track Subtasks & History"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTemplatesModalOpen(true)}
              className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Zap size="1em" />
              <span>Use Template</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2"
            >
              <Plus className="w-4 h-4"  />
              <span>Create & Assign Task</span>
            </button>
          </div>
        }
      />

      {/* Top Stats Cards */}
      <TaskStats {...view} />

      {/* Navigation View Tabs */}
      <TaskViewTabs {...view} />

      {/* VIEW 1: KANBAN BOARD */}
      {activeTab === 'kanban' && <KanbanView {...view} />}

      {/* VIEW 2: TABLE VIEW */}
      {activeTab === 'table' && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <DataTable columns={columns} data={tasks} isLoading={isLoading} />
          <Pagination currentPage={page} totalPages={totalPages} totalRecords={totalRecords} onPageChange={setPage} />
        </div>
      )}

      {/* VIEW 3: CLIENT WORK REQUESTS INBOX */}
      {activeTab === 'requests' && <RequestsInbox {...view} />}

      {/* Task Detail Hub Modal */}
      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Templates Modal */}
      <TaskTemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectTemplate={() => {
          setIsTemplatesModalOpen(false);
          setIsCreateModalOpen(true);
        }}
      />

      <ApproveRequestModal {...view} />
    </div>
  );
};
