import { useState } from 'react';
import toast from 'react-hot-toast';
import { useFirmClients, useFirmUsers } from '../../../queries/useLookups';
import { useCreateTask } from '../../../queries/useTasks';

export const useCreateTaskForm = ({ isOpen, onClose, onTaskCreated }) => {
  const { data: clients = [] } = useFirmClients({ limit: 100 }, { enabled: isOpen });
  const { data: users = [] } = useFirmUsers({ limit: 100 }, { enabled: isOpen });
  const createTaskMutation = useCreateTask();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [assignmentScope, setAssignmentScope] = useState('SINGLE'); // 'SINGLE' | 'MULTIPLE' | 'ALL'
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setClientId('');
    setPriority('MEDIUM');
    setDueDate('');
    setAssignmentScope('SINGLE');
    setSelectedUserIds([]);
    setSubtasks([]);
    setSubtaskInput('');
  };

  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) return;
    setSubtasks([...subtasks, subtaskInput.trim()]);
    setSubtaskInput('');
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleUserToggle = (uId) => {
    if (selectedUserIds.includes(uId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== uId));
    } else {
      setSelectedUserIds([...selectedUserIds, uId]);
    }
  };

  // Switching to "one person" keeps at most the first selected person.
  const changeScope = (scope) => {
    setAssignmentScope(scope);
    if (scope === 'SINGLE') setSelectedUserIds(selectedUserIds.slice(0, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }

    if (assignmentScope === 'SINGLE' && selectedUserIds.length === 0) {
      toast.error('Please select an employee for task assignment');
      return;
    }

    if (assignmentScope === 'MULTIPLE' && selectedUserIds.length === 0) {
      toast.error('Please select at least one employee for team assignment');
      return;
    }

    createTaskMutation.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        clientId: clientId ? parseInt(clientId, 10) : null,
        priority,
        dueDate: dueDate || null,
        assignmentScope,
        assignedUserIds: selectedUserIds,
        subtasks,
      },
      {
        onSuccess: () => {
          onClose();
          if (onTaskCreated) onTaskCreated();
          resetForm();
        },
      }
    );
  };

  return {
    clients, users,
    title, setTitle,
    description, setDescription,
    clientId, setClientId,
    priority, setPriority,
    dueDate, setDueDate,
    assignmentScope, changeScope,
    selectedUserIds, setSelectedUserIds, handleUserToggle,
    subtasks, subtaskInput, setSubtaskInput, handleAddSubtask, handleRemoveSubtask,
    handleSubmit, createTaskMutation,
  };
};
