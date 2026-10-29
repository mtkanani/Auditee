import React from 'react';
import { useDualPanelAssignment } from './useDualPanelAssignment';
import { ClientPanel } from './ClientPanel';
import { UserPanel } from './UserPanel';
import { ActionColumn } from './ActionColumn';
import { AssignmentTabs } from './AssignmentTabs';
import { DirectTaskModal } from './DirectTaskModal';

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
  const panel = useDualPanelAssignment({ clients, users, assignments, onAssign, onCreateTask });

  return (
    <div className="space-y-6">
      {/* Pick a client and an employee, then act */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Left Panel: Clients List (2 Cols) */}
        <ClientPanel {...panel} />

        {/* Right Panel: Employee Users List (2 Cols) */}
        <UserPanel {...panel} />

        {/* Action Column (1 Col) */}
        <ActionColumn {...panel} isLoading={isLoading} />
      </div>

      {/* Tabs Header */}
      <AssignmentTabs {...panel} assignments={assignments} tasks={tasks} onUnassign={onUnassign} />

      {/* Direct Task Modal */}
      <DirectTaskModal {...panel} clients={clients} />
    </div>
  );
};
