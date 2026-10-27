import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDebounce } from '../../../hooks/useDebounce';
import {
  useComplianceItems,
  useGenerateIndianPresets,
  useUpdateComplianceStatus,
  useConvertComplianceToTask,
  useSendComplianceReminder,
  useCreateComplianceItem,
} from '../../../queries/useCompliance';
import { useFirmClients, useFirmUsers } from '../../../queries/useLookups';

export const useCompliancePage = () => {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'table'

  // Filters
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected Month/Year for Statutory Presets Generator
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [assignedUserIds, setAssignedUserIds] = useState([]);

  // New Custom Item Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('GST');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPeriod, setNewPeriod] = useState('');
  const [newClientId, setNewClientId] = useState('');
  const [newPenalty, setNewPenalty] = useState('');

  const [page, setPage] = useState(1);

  const {
    items,
    pagination,
    summary,
    isLoading,
    error,
  } = useComplianceItems({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    category: categoryFilter || undefined,
    status: statusFilter || undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryFilter, statusFilter]);

  const { data: clients = [] } = useFirmClients({ limit: 100 });
  const { data: users = [] } = useFirmUsers({ limit: 100 });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load compliance tracker data');
    }
  }, [error]);

  const generatePresetsMutation = useGenerateIndianPresets();
  const updateStatusMutation = useUpdateComplianceStatus();
  const convertToTaskMutation = useConvertComplianceToTask();
  const sendReminderMutation = useSendComplianceReminder();
  const createComplianceItemMutation = useCreateComplianceItem();

  const handleGeneratePresets = () => {
    generatePresetsMutation.mutate({ year: selectedYear, month: selectedMonth });
  };

  const handleStatusChange = (id, newStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleConvertToTaskSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    convertToTaskMutation.mutate(
      { id: selectedItem.id, taskOptions: { assignedUserIds } },
      {
        onSuccess: () => {
          setIsTaskModalOpen(false);
          setSelectedItem(null);
          setAssignedUserIds([]);
        },
      }
    );
  };

  const handleSendReminder = (item) => {
    sendReminderMutation.mutate(item.id, {
      onSuccess: () => {
        toast.success(`Deadline reminder broadcasted on Notice Board for ${item.title}!`);
      },
    });
  };

  const handleAddCustomSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate) {
      toast.error('Title and Due Date are required');
      return;
    }
    createComplianceItemMutation.mutate(
      {
        title: newTitle.trim(),
        category: newCategory,
        dueDate: newDueDate,
        period: newPeriod.trim(),
        clientId: newClientId ? parseInt(newClientId, 10) : null,
        penaltyDetails: newPenalty.trim(),
      },
      {
        onSuccess: () => {
          setIsAddModalOpen(false);
          setNewTitle('');
          setNewDueDate('');
          setNewPeriod('');
          setNewPenalty('');
        },
      }
    );
  };

  // Metrics cover every matching item (computed server-side), not just this page
  const totalItems = summary?.total || 0;
  const pendingCount = summary?.pending || 0;
  const overdueCount = summary?.overdue || 0;
  const filedCount = summary?.filed || 0;

  return {
    viewMode,
    setViewMode,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    isAddModalOpen,
    setIsAddModalOpen,
    isTaskModalOpen,
    setIsTaskModalOpen,
    selectedItem,
    setSelectedItem,
    assignedUserIds,
    setAssignedUserIds,
    newTitle,
    setNewTitle,
    newCategory,
    setNewCategory,
    newDueDate,
    setNewDueDate,
    newPeriod,
    setNewPeriod,
    newClientId,
    setNewClientId,
    newPenalty,
    setNewPenalty,
    page,
    setPage,
    items,
    pagination,
    isLoading,
    clients,
    users,
    generatePresetsMutation,
    convertToTaskMutation,
    createComplianceItemMutation,
    handleGeneratePresets,
    handleStatusChange,
    handleConvertToTaskSubmit,
    handleSendReminder,
    handleAddCustomSubmit,
    totalItems,
    pendingCount,
    overdueCount,
    filedCount,
  };
};
