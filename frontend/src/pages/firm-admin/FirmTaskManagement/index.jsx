import React from 'react';
import { Plus, Zap } from 'lucide-react';
import { Pagination } from '../../../components/common/Pagination';
import { TaskDetailModal } from '../../../components/tasks/TaskDetailModal';
import { CreateTaskModal } from '../../../components/tasks/CreateTaskModal';
import { TaskTemplatesModal } from '../../../components/tasks/TaskTemplatesModal';
import { Button, PageHeader, Table } from '../../../components/ui';
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
    setSelectedTaskId,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isTemplatesModalOpen,
    setIsTemplatesModalOpen,
  } = view;

  const columns = getTaskColumns(view);
  const openTask = (task) => {
    setSelectedTaskId(task.id);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Tasks"
        description="Assign work to one, several or all employees, track checklists and approve client requests."
        actions={
          <>
            <Button variant="soft" icon={Zap} onClick={() => setIsTemplatesModalOpen(true)}>
              Use template
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
              New task
            </Button>
          </>
        }
      />

      <TaskStats {...view} />

      <TaskViewTabs {...view} />

      {activeTab === 'kanban' && <KanbanView {...view} onOpen={openTask} />}

      {activeTab === 'table' && (
        <Table
          columns={columns}
          data={tasks}
          isLoading={isLoading}
          onRowClick={openTask}
          footer={<Pagination currentPage={page} totalPages={totalPages} totalRecords={totalRecords} limit={20} onPageChange={setPage} />}
        />
      )}

      {activeTab === 'requests' && <RequestsInbox {...view} />}

      <TaskDetailModal taskId={selectedTaskId} isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} />

      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

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
