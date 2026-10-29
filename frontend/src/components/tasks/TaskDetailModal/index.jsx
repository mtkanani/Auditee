import React from 'react';
import { Loader2 } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { useTaskDetailModal } from './useTaskDetailModal';
import { TaskModalTitle } from './TaskModalTitle';
import { TaskStatusSelect } from './TaskStatusSelect';
import { TaskSummary } from './TaskSummary';
import { ChecklistProgress } from './ChecklistProgress';
import { TaskTabs } from './TaskTabs';
import { SubtasksTab } from './SubtasksTab';
import { CommentsTab } from './CommentsTab';
import { AttachmentsTab } from './AttachmentsTab';
import { HistoryTab } from './HistoryTab';

export const TaskDetailModal = ({ taskId, isOpen, onClose, onRefresh }) => {
  const detail = useTaskDetailModal({ taskId, isOpen, onRefresh });
  const { task, isLoading, activeTab, totalSubtasks } = detail;

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<TaskModalTitle task={task} />}
      headerActions={<TaskStatusSelect {...detail} />}
      maxWidth="max-w-4xl"
    >
      <div className="-m-6 flex flex-col min-h-0">
        <TaskSummary task={task} />

        {totalSubtasks > 0 && <ChecklistProgress {...detail} />}

        <TaskTabs {...detail} />

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Loading task…
            </div>
          ) : (
            <>
              {activeTab === 'subtasks' && <SubtasksTab {...detail} />}
              {activeTab === 'comments' && <CommentsTab {...detail} />}
              {activeTab === 'documents' && <AttachmentsTab {...detail} />}
              {activeTab === 'history' && <HistoryTab task={task} />}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
