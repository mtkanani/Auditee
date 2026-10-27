import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useDebounce } from '../../../hooks/useDebounce';
import {
  useFirmTasks,
  useClientRequests,
  useUpdateTaskStatus,
  useApproveClientRequest,
  useRejectClientRequest,
} from '../../../queries/useTasks';
import { useFirmUsers } from '../../../queries/useLookups';
import { useConfirm } from '../../../components/common/ConfirmProvider';

export const useFirmTaskManagement = () => {
  const confirm = useConfirm();
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'table' | 'requests'

  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Client Request Approval Form Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [requestAssignmentScope, setRequestAssignmentScope] = useState('SINGLE');
  const [requestSelectedUserIds, setRequestSelectedUserIds] = useState([]);

  const debouncedSearch = useDebounce(search, 400);

  // Queries
  const {
    tasks,
    pagination,
    isLoading,
    error: tasksError,
  } = useFirmTasks({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
  });

  const { requests: clientRequests = [] } = useClientRequests();
  const { data: users = [] } = useFirmUsers({ limit: 100 });

  // Mutations
  const updateTaskStatusMutation = useUpdateTaskStatus();
  const approveRequestMutation = useApproveClientRequest();
  const rejectRequestMutation = useRejectClientRequest();

  const totalPages = pagination?.totalPages || 1;
  const totalRecords = pagination?.totalRecords || 0;

  useEffect(() => {
    if (tasksError) {
      toast.error('Failed to load firm tasks');
    }
  }, [tasksError]);

  // Memoize Kanban task grouping to avoid O(columns * tasks) filter loops on each render
  const tasksByStatus = useMemo(() => {
    const map = { PENDING: [], IN_PROGRESS: [], UNDER_REVIEW: [], COMPLETED: [] };
    for (const t of tasks) {
      if (map[t.status]) {
        map[t.status].push(t);
      } else {
        map[t.status] = [t];
      }
    }
    return map;
  }, [tasks]);

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskStatusMutation.mutate({ taskId, status: newStatus });
  };

  const handleApproveRequestSubmit = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    if (requestAssignmentScope === 'SINGLE' && requestSelectedUserIds.length === 0) {
      toast.error('Please select an employee to assign this client request');
      return;
    }

    approveRequestMutation.mutate(
      {
        taskId: selectedRequest.id,
        approvalData: {
          assignmentScope: requestAssignmentScope,
          assignedUserIds: requestSelectedUserIds,
        },
      },
      {
        onSuccess: () => {
          setIsApproveModalOpen(false);
          setSelectedRequest(null);
        },
      }
    );
  };

  const handleRejectRequest = async (taskId) => {
    const ok = await confirm({
      title: 'Reject Request',
      message: 'Are you sure you want to reject this client work request?',
      confirmText: 'Reject',
      isDanger: true,
    });
    if (!ok) return;
    rejectRequestMutation.mutate(taskId);
  };

  // Metrics
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;

  return {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isTemplatesModalOpen,
    setIsTemplatesModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    selectedTaskId,
    setSelectedTaskId,
    selectedRequest,
    setSelectedRequest,
    isApproveModalOpen,
    setIsApproveModalOpen,
    requestAssignmentScope,
    setRequestAssignmentScope,
    requestSelectedUserIds,
    setRequestSelectedUserIds,
    tasks,
    isLoading,
    clientRequests,
    users,
    approveRequestMutation,
    rejectRequestMutation,
    totalPages,
    totalRecords,
    tasksByStatus,
    handleStatusChange,
    handleApproveRequestSubmit,
    handleRejectRequest,
    inProgressCount,
    completedCount,
  };
};
