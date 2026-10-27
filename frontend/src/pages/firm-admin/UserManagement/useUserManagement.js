import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from '../../../hooks/useDebounce';
import { exportToCsv } from '../../../utils/exportToCsv';
import {
  useFirmUsersList,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useUpdateUserStatus,
  useResetUserPassword,
} from '../../../queries/useUsers';

export const useUserManagement = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { register: regCreate, handleSubmit: handleSubmitCreate, reset: resetCreate } = useForm();
  const { register: regEdit, handleSubmit: handleSubmitEdit, reset: resetEdit } = useForm();
  const { register: regReset, handleSubmit: handleSubmitReset, reset: resetReset } = useForm();

  const queryParams = useMemo(() => ({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
  }), [page, debouncedSearch, roleFilter, statusFilter]);

  const { users, totalPages, totalRecords, isLoading } = useFirmUsersList(queryParams);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const updateUserStatusMutation = useUpdateUserStatus();
  const resetUserPasswordMutation = useResetUserPassword();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter, statusFilter]);

  const handleCreateUser = async (data) => {
    try {
      await createUserMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
      resetCreate();
    } catch {
      // toast error handled in hook
    }
  };

  const handleEditUser = async (data) => {
    if (!selectedUser) return;
    try {
      await updateUserMutation.mutateAsync({ id: selectedUser.id, data });
      setIsEditModalOpen(false);
    } catch {
      // toast error handled in hook
    }
  };

  const handleStatusChange = (userId, newStatus) => {
    updateUserStatusMutation.mutate({ id: userId, status: newStatus });
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      setIsDeleteModalOpen(false);
    } catch {
      // toast error handled in hook
    }
  };

  const handleResetPassword = async (data) => {
    if (!selectedUser) return;
    try {
      await resetUserPasswordMutation.mutateAsync({ id: selectedUser.id, newPassword: data.newPassword });
      setIsResetPasswordOpen(false);
      resetReset();
    } catch {
      // toast error handled in hook
    }
  };

  const handleExport = () => {
    const exportData = users.map((u) => ({
      Name: `${u.firstName} ${u.lastName}`,
      Email: u.email,
      Mobile: u.mobileNumber || u.phone,
      Designation: u.designation || 'Staff',
      City: u.city,
      Role: u.role,
      Status: u.status,
    }));
    exportToCsv(exportData, 'auditee_firm_users.csv');
  };

  return {
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDetailDrawerOpen,
    setIsDetailDrawerOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isResetPasswordOpen,
    setIsResetPasswordOpen,
    selectedUser,
    setSelectedUser,
    regCreate,
    handleSubmitCreate,
    resetCreate,
    regEdit,
    handleSubmitEdit,
    resetEdit,
    regReset,
    handleSubmitReset,
    users,
    totalPages,
    totalRecords,
    isLoading,
    handleCreateUser,
    handleEditUser,
    handleStatusChange,
    handleDeleteUser,
    handleResetPassword,
    handleExport,
  };
};
