import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Building2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button, FilterBar, PageHeader, SearchInput, Select, Table } from '../../../components/ui';
import { EmptyState } from '../../../components/common/EmptyState';
import { Pagination } from '../../../components/common/Pagination';
import { Modal } from '../../../components/common/Modal';
import { useConfirm } from '../../../components/common/ConfirmProvider';
import { useDebounce } from '../../../hooks/useDebounce';
import FirmForm from '../../../components/FirmManagement/FirmForm';
import { FIRM_STATUSES, getFirmColumns } from './firmColumns';
import { EditFirmDialog, ResetAdminPasswordDialog } from './FirmDialogs';
import {
  useFirmsList,
  useCreateFirm,
  useUpdateFirm,
  useDeleteFirm,
  useUpdateFirmStatus,
  useResetFirmAdminPassword,
} from '../../../queries/useFirms';

const STATUS_FILTERS = [{ value: '', label: 'All statuses' }, ...FIRM_STATUSES];

export const FirmManagement = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const confirm = useConfirm();

  // Modals state
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(Boolean(location.state?.openCreate));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState(null);

  const editForm = useForm();

  const queryParams = useMemo(() => ({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
  }), [page, debouncedSearch, statusFilter]);

  const { firms, totalPages, totalRecords, isLoading } = useFirmsList(queryParams);

  const createFirmMutation = useCreateFirm();
  const updateFirmMutation = useUpdateFirm();
  const deleteFirmMutation = useDeleteFirm();
  const updateFirmStatusMutation = useUpdateFirmStatus();
  const resetFirmAdminPasswordMutation = useResetFirmAdminPassword();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleCreateFirm = async (firmData, adminData) => {
    try {
      await createFirmMutation.mutateAsync({ firm: firmData, firmAdmin: adminData });
      setIsCreateModalOpen(false);
    } catch {
      // toast error handled in hook
    }
  };

  const handleEditFirm = async (data) => {
    if (!selectedFirm) return;
    try {
      await updateFirmMutation.mutateAsync({ id: selectedFirm.id, data });
      setIsEditModalOpen(false);
    } catch {
      // toast error handled in hook
    }
  };

  const handleDeleteFirm = async (firm) => {
    const ok = await confirm({
      title: 'Delete firm?',
      message: `"${firm.firmName}" will be deleted and all of its users signed out.`,
      confirmText: 'Delete firm',
    });
    if (!ok) return;
    try {
      await deleteFirmMutation.mutateAsync(firm.id);
    } catch {
      // toast error handled in hook
    }
  };

  // Returns true on success so the dialog can clear its field.
  const handleResetPassword = async (data) => {
    if (!selectedFirm) return false;
    try {
      await resetFirmAdminPasswordMutation.mutateAsync({ id: selectedFirm.id, newPassword: data.newPassword });
      setIsResetPasswordOpen(false);
      return true;
    } catch {
      // toast error handled in hook
      return false;
    }
  };

  const columns = getFirmColumns({
    onStatusChange: (id, status) => updateFirmStatusMutation.mutate({ id, status }),
    onEdit: (firm) => {
      setSelectedFirm(firm);
      editForm.reset(firm);
      setIsEditModalOpen(true);
    },
    onResetPassword: (firm) => {
      setSelectedFirm(firm);
      setIsResetPasswordOpen(true);
    },
    onDelete: handleDeleteFirm,
  });

  const filtered = Boolean(search || statusFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Firms"
        description="Create, edit and manage the CA firms on Auditee."
        actions={
          <Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
            New firm
          </Button>
        }
      />

      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search name, email or city" />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={STATUS_FILTERS}
          aria-label="Status"
          className="sm:w-44"
        />
      </FilterBar>

      <Table
        columns={columns}
        data={firms}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={Building2}
            title={filtered ? 'No firms match' : 'No firms yet'}
            description={filtered ? 'Try a different search or status.' : 'Create the first firm to get started.'}
          />
        }
        footer={
          totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} totalRecords={totalRecords} onPageChange={setPage} />
        }
      />

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="New firm" maxWidth="max-w-3xl">
        <FirmForm onSubmit={handleCreateFirm} onCancel={() => setIsCreateModalOpen(false)} isEdit={false} />
      </Modal>

      <EditFirmDialog
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        form={editForm}
        onSubmit={handleEditFirm}
        isSaving={updateFirmMutation.isPending}
      />

      <ResetAdminPasswordDialog
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        firm={selectedFirm}
        onSubmit={handleResetPassword}
        isSaving={resetFirmAdminPasswordMutation.isPending}
      />
    </div>
  );
};
