import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable } from '../../../components/common/DataTable';
import { Pagination } from '../../../components/common/Pagination';
import { ConfirmationModal } from '../../../components/common/ConfirmationModal';
import { ClientDetailModal } from '../../../components/clients/ClientDetailModal';
import { AddMasterClientModal } from '../../../components/clients/AddMasterClientModal';
import { Plus } from 'lucide-react';
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
    isDetailModalOpen,
    setIsDetailModalOpen,
    isCreateModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteClient,
    deleteClientMutation,
  } = view;

  const columns = getClientColumns(view);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Master Management"
        subtitle="360-degree client hub: Tax Identifiers (PAN, GST, TAN, CIN), Subscribed CA Services, Billing & Master Documents"
        actions={
          <button
            onClick={() => {
              setIsCreateModalOpen(true);
            }}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            <Plus className="w-4 h-4"  />
            <span>Add Master Client</span>
          </button>
        }
      />

      {/* Top Metrics Cards */}
      <ClientStats {...view} />

      {/* Filter Bar */}
      <ClientFilters {...view} />

      {/* Main Client Table */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <DataTable columns={columns} data={clients} isLoading={isLoading} />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={setPage}
        />
      </div>

      {/* 360-Degree Client Detail Master Modal */}
      <ClientDetailModal
        clientId={selectedClient?.id}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {/* Create Master Client Gated Verification Modal */}
      <AddMasterClientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Client Modal */}
      <EditClientModal {...view} />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteClient}
        isLoading={deleteClientMutation.isPending}
        title="Delete Client Master Account"
        message={`Are you sure you want to delete client "${selectedClient?.clientName}"?`}
      />
    </div>
  );
};
