import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';

export const useDualPanelAssignment = ({ clients, users, assignments, onAssign, onCreateTask }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchClient, setSearchClient] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [activeTab, setActiveTab] = useState('assignments'); // 'assignments' | 'tasks'

  // Task Modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    clientId: '',
  });
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const assignedCountByClient = useMemo(() => {
    const m = new Map();
    for (const a of assignments) {
      m.set(a.clientId, (m.get(a.clientId) || 0) + 1);
    }
    return m;
  }, [assignments]);

  const filteredClients = useMemo(() => {
    const q = searchClient.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.clientName?.toLowerCase().includes(q) ||
        c.companyName?.toLowerCase().includes(q)
    );
  }, [clients, searchClient]);

  const filteredUsers = useMemo(() => {
    const q = searchUser.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [users, searchUser]);

  const handleAssignClick = async () => {
    if (!selectedClient || !selectedUser) return;
    await onAssign(selectedUser.id, selectedClient.id);
    setSelectedClient(null);
    setSelectedUser(null);
  };

  const handleOpenTaskModal = () => {
    if (!selectedUser) {
      toast.error('Please select an employee user first to assign a task');
      return;
    }
    setTaskForm({
      title: '',
      description: '',
      priority: 'MEDIUM',
      dueDate: '',
      clientId: selectedClient ? String(selectedClient.id) : '',
    });
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    if (!selectedUser) return;

    setIsSubmittingTask(true);
    try {
      await onCreateTask({
        userId: selectedUser.id,
        clientId: taskForm.clientId ? parseInt(taskForm.clientId, 10) : null,
        title: taskForm.title.trim(),
        description: taskForm.description.trim(),
        priority: taskForm.priority,
        dueDate: taskForm.dueDate || null,
      });
      setIsTaskModalOpen(false);
      setSelectedUser(null);
      setSelectedClient(null);
    } catch {
      // Error handled in parent toast
    } finally {
      setIsSubmittingTask(false);
    }
  };

  return {
    selectedClient,
    setSelectedClient,
    selectedUser,
    setSelectedUser,
    searchClient,
    setSearchClient,
    searchUser,
    setSearchUser,
    activeTab,
    setActiveTab,
    isTaskModalOpen,
    setIsTaskModalOpen,
    taskForm,
    setTaskForm,
    isSubmittingTask,
    assignedCountByClient,
    filteredClients,
    filteredUsers,
    handleAssignClick,
    handleOpenTaskModal,
    handleTaskSubmit,
  };
};
