import React from 'react';
import { PageHeader } from '../../components/ui';
import { DualPanelAssignment } from '../../components/assignments/DualPanelAssignment';
import { useFirmUsers, useFirmClients } from '../../queries/useLookups';
import { useFirmTasks, useCreateTask } from '../../queries/useTasks';
import { useAllAssignments, useAssignClient, useRemoveAssignment } from '../../queries/useUsers';

export const ClientAssignments = () => {
  const { data: clients = [], isLoading: isClientsLoading } = useFirmClients({ limit: 100 });
  const { data: users = [], isLoading: isUsersLoading } = useFirmUsers({ limit: 100 });
  const { assignments, isLoading: isAssignmentsLoading } = useAllAssignments();
  const { tasks, isLoading: isTasksLoading } = useFirmTasks();

  const assignClientMutation = useAssignClient();
  const removeAssignmentMutation = useRemoveAssignment();
  const createTaskMutation = useCreateTask();

  const isLoading = isClientsLoading || isUsersLoading || isAssignmentsLoading || isTasksLoading;

  const handleAssign = async (userId, clientId) => {
    try {
      await assignClientMutation.mutateAsync({ userId, clientId });
    } catch {
      // toast handled in mutation hook
    }
  };

  const handleUnassign = async (userId, clientId) => {
    try {
      await removeAssignmentMutation.mutateAsync({ userId, clientId });
    } catch {
      // toast handled in mutation hook
    }
  };

  const handleCreateTask = (taskData) => {
    return createTaskMutation.mutateAsync(taskData);
  };

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Assignments"
        description="Decide who looks after which client, or hand an employee a task directly."
      />

      <DualPanelAssignment
        clients={clients}
        users={users}
        assignments={assignments}
        tasks={tasks}
        onAssign={handleAssign}
        onUnassign={handleUnassign}
        onCreateTask={handleCreateTask}
        isLoading={isLoading}
      />
    </div>
  );
};
