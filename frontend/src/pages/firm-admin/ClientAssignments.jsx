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
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [clientsRes, usersRes, assignRes] = await Promise.all([
        firmAdminService.getClients({ limit: 100 }),
        firmAdminService.getUsers({ limit: 100 }),
        assignmentService.getAllAssignments(),
      ]);

      setClients(clientsRes.data || clientsRes.clients || []);
      setUsers(usersRes.data || usersRes.users || []);
      setAssignments(assignRes.data || assignRes.assignments || []);
    } catch (error) {
      toast.error('Failed to load assignment data');
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Assignment Workstation"
        subtitle="Pair CA firm clients with dedicated staff accountants and auditors using dual-panel controls"
      />

      <DualPanelAssignment
        clients={clients}
        users={users}
        assignments={assignments}
        onAssign={handleAssign}
        onUnassign={handleUnassign}
        isLoading={isLoading}
      />
    </div>
  );
};
