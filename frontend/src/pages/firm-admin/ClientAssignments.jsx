import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DualPanelAssignment } from '../../components/assignments/DualPanelAssignment';
import { assignmentService } from '../../services/assignmentService';
import { firmAdminService } from '../../services/firmAdminService';
import toast from 'react-hot-toast';

export const ClientAssignments = () => {
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [clientsRes, usersRes, assignRes, tasksRes] = await Promise.all([
        firmAdminService.getClients({ limit: 100 }),
        firmAdminService.getUsers({ limit: 100 }),
        assignmentService.getAllAssignments(),
        assignmentService.getFirmTasks(),
      ]);

      setClients(clientsRes.data || clientsRes.clients || []);
      setUsers(usersRes.data || usersRes.users || []);
      setAssignments(assignRes.data || assignRes.assignments || []);
      setTasks(tasksRes.data || tasksRes.tasks || []);
    } catch (error) {
      toast.error('Failed to load assignment workstation data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (userId, clientId) => {
    try {
      await assignmentService.assignClient(userId, clientId);
      toast.success('Client assigned to employee successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to assign client.');
    }
  };

  const handleUnassign = async (userId, clientId) => {
    try {
      await assignmentService.removeAssignment(userId, clientId);
      toast.success('Assignment removed!');
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to remove assignment.');
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await assignmentService.createTask(taskData);
      toast.success('Task created and assigned successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to create task.');
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Assignment Workstation"
        subtitle="Pair CA firm clients with staff members or assign direct tasks directly to dedicated auditors"
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
