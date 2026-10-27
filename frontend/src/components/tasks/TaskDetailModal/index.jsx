import React from 'react';
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
        {/* Assignees & Description Header */}
          <TaskSummary task={task} />

          {/* Subtask Progress Bar */}
          {totalSubtasks > 0 && <ChecklistProgress {...detail} />}

          {/* Navigation Tabs */}
          <TaskTabs {...detail} />

          {/* Modal Tab Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="p-12 text-center text-sm text-slate-500">Loading task hub details...</div>
            ) : (
              <>
                {/* TAB 1: Subtasks Checklist */}
                {activeTab === 'subtasks' && <SubtasksTab {...detail} />}

                {/* TAB 2: Discussion Thread */}
                {activeTab === 'comments' && <CommentsTab {...detail} />}

                {/* TAB 3: Attachments */}
                {activeTab === 'documents' && <AttachmentsTab {...detail} />}

                {/* TAB 4: Audit History */}
                {activeTab === 'history' && <HistoryTab task={task} />}
              </>
            )}
          </div>
      </div>
    </Modal>
  );
};
