import React from 'react';
import { Plus, UserPlus } from 'lucide-react';
import { Pagination } from '../../../components/common/Pagination';
import { ConfirmationModal } from '../../../components/common/ConfirmationModal';
import { EmptyState } from '../../../components/common/EmptyState';
import { ClientDetailModal } from '../../../components/clients/ClientDetailModal';
import { AddMasterClientModal } from '../../../components/clients/AddMasterClientModal';
import { Button, PageHeader, Table } from '../../../components/ui';
import { useClientManagement } from './useClientManagement';
import { getClientColumns } from './clientColumns';
import { ClientStats } from './ClientStats';
import { ClientFilters } from './ClientFilters';
import { EditClientModal } from './EditClientModal';

export const ClientManagement = () => {
  const view = useClientManagement();
  const {
    setIsCreateModalOpen,
    clients,
    isLoading,
    page,
    totalPages,
    totalRecords,
    setPage,
    selectedClient,
    setSelectedClient,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isCreateModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteClient,
    deleteClientMutation,
  } = view;

  const columns = getClientColumns(view);
  const openClient = (client) => {
    setSelectedClient(client);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Clients"
        description="Every client's tax IDs, services, billing and documents in one place."
        actions={
          <Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
            Add client
          </Button>
        }
      />

      <ClientStats {...view} />

      <ClientFilters {...view} />

      <Table
        columns={columns}
        data={clients}
        isLoading={isLoading}
        onRowClick={openClient}
        emptyState={
          <EmptyState
            icon={UserPlus}
            title="No clients found"
            description="Try a different search, or add your first client to start tracking their filings."
            action={<Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>Add client</Button>}
          />
        }
        footer={<Pagination currentPage={page} totalPages={totalPages} totalRecords={totalRecords} limit={10} onPageChange={setPage} />}
      />

      <ClientDetailModal clientId={selectedClient?.id} isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} />

      <AddMasterClientModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      <EditClientModal {...view} />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteClient}
        isLoading={deleteClientMutation.isPending}
        title="Delete client"
        message={`Delete the client "${selectedClient?.clientName}"?`}
      />
    </div>
  );
};
