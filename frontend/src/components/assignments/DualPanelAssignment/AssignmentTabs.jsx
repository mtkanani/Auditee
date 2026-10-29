import React from 'react';
import { Layers, ListChecks } from 'lucide-react';
import { Tabs } from '../../ui';
import { AssignmentsTable } from './AssignmentsTable';
import { TasksTable } from './TasksTable';

export const AssignmentTabs = ({ activeTab, setActiveTab, assignments, tasks, onUnassign }) => (
  <div className="space-y-4">
    <Tabs
      aria-label="Assignments view"
      value={activeTab}
      onChange={setActiveTab}
      items={[
        { value: 'assignments', label: 'Client pairs', icon: Layers, count: assignments.length },
        { value: 'tasks', label: 'Tasks', icon: ListChecks, count: tasks.length },
      ]}
    />
    {activeTab === 'assignments' && <AssignmentsTable assignments={assignments} onUnassign={onUnassign} />}
    {activeTab === 'tasks' && <TasksTable tasks={tasks} />}
  </div>
);
