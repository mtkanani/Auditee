import React from 'react';
import { Clock, ListChecks, MessageSquare, Paperclip } from 'lucide-react';
import { Tabs } from '../../ui';

export const TaskTabs = ({ activeTab, setActiveTab, totalSubtasks, task }) => (
  <Tabs
    variant="underline"
    aria-label="Task sections"
    value={activeTab}
    onChange={setActiveTab}
    className="px-6"
    items={[
      { value: 'subtasks', label: 'Checklist', icon: ListChecks, count: totalSubtasks },
      { value: 'comments', label: 'Discussion', icon: MessageSquare, count: task?.comments?.length || 0 },
      { value: 'documents', label: 'Files', icon: Paperclip, count: task?.documents?.length || 0 },
      { value: 'history', label: 'History', icon: Clock, count: task?.history?.length || 0 },
    ]}
  />
);
