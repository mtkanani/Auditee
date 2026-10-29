import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDebounce } from '../../../hooks/useDebounce';
import {
  useFirmClientsList,
  useUpdateClient,
  useUpdateClientStatus,
  useDeleteClient,
} from '../../../queries/useClients';

export const useClientManagement = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [clientTypeFilter, setClientTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Modals & Drawers
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(Boolean(location.state?.openCreate));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const { register: regEdit, handleSubmit: handleSubmitEdit, reset: resetEdit } = useForm();

  const {
    clients,
    pagination,
    isLoading,
    error: clientsError,
  } = useFirmClientsList({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    clientType: clientTypeFilter || undefined,
    status: statusFilter || undefined,
  });

  const updateClientMutation = useUpdateClient();
  const updateStatusMutation = useUpdateClientStatus();
  const deleteClientMutation = useDeleteClient();

  useEffect(() => {
    if (clientsError) {
      toast.error('Failed to fetch clients');
    }
  }, [clientsError]);

  const totalPages = pagination?.totalPages || 1;
  const totalRecords = pagination?.totalRecords || (pagination ? 0 : clients.length);

  const handleEditClient = (data) => {
    if (!selectedClient) return;
    updateClientMutation.mutate(
      { clientId: selectedClient.id, data },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
        },
      }
    );
  };

  const handleStatusChange = (clientId, newStatus) => {
    updateStatusMutation.mutate({ clientId, status: newStatus });
  };

  const handleDeleteClient = () => {
    if (!selectedClient) return;
    deleteClientMutation.mutate(selectedClient.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
      },
    });
  };

  // Metrics Calculations
  const totalSubscribedServices = clients.reduce((acc, c) => acc + (c.services?.length || 0), 0);
  const totalOutstandingBalance = clients.reduce((acc, c) => acc + (c.outstandingBalance || 0), 0);

  return {
    search,
    setSearch,
    clientTypeFilter,
    setClientTypeFilter,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedClient,
    setSelectedClient,
    regEdit,
    handleSubmitEdit,
    resetEdit,
    clients,
    isLoading,
    updateClientMutation,
    deleteClientMutation,
    totalPages,
    totalRecords,
    handleEditClient,
    handleStatusChange,
    handleDeleteClient,
    totalSubscribedServices,
    totalOutstandingBalance,
  };
};
