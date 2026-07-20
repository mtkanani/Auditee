import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { Pagination } from '../../components/common/Pagination';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Drawer } from '../../components/common/Drawer';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiBriefcase } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { firmAdminService } from '../../services/firmAdminService';

export const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const { register: regCreate, handleSubmit: handleSubmitCreate, reset: resetCreate } = useForm();
  const { register: regEdit, handleSubmit: handleSubmitEdit, reset: resetEdit } = useForm();

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const res = await firmAdminService.getClients({
        page,
        limit: 10,
        search,
        status: statusFilter || undefined,
      });
      setClients(res.data || res.clients || []);
      setTotalPages(res.pagination?.totalPages || 1);
      setTotalRecords(res.pagination?.totalRecords || (res.data ? res.data.length : 0));
    } catch (error) {
      toast.error('Failed to fetch clients');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page, search, statusFilter]);

  const handleCreateClient = async (data) => {
    try {
      await firmAdminService.createClient(data);
      toast.success('Client created successfully!');
      setIsCreateModalOpen(false);
      resetCreate();
      fetchClients();
    } catch (error) {
      toast.error(error.message || 'Failed to create client.');
    }
  };

  const handleEditClient = async (data) => {
    if (!selectedClient) return;
    try {
      await firmAdminService.updateClient(selectedClient.id, data);
      toast.success('Client updated successfully!');
      setIsEditModalOpen(false);
      fetchClients();
    } catch (error) {
      toast.error(error.message || 'Failed to update client.');
    }
  };

  const handleStatusChange = async (clientId, newStatus) => {
    try {
      await firmAdminService.updateClientStatus(clientId, newStatus);
      toast.success(`Client status updated to ${newStatus}`);
      fetchClients();
    } catch (error) {
      toast.error(error.message || 'Failed to update client status.');
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    try {
      await firmAdminService.deleteClient(selectedClient.id);
      toast.success('Client deleted successfully!');
      setIsDeleteModalOpen(false);
      fetchClients();
    } catch (error) {
      toast.error(error.message || 'Failed to delete client.');
    }
  };

  const columns = [
    {
      header: 'Client / Company Name',
      key: 'name',
      render: (r) => (
        <div>
          <p className="font-bold text-slate-100">{r.clientName}</p>
          <p className="text-xs text-slate-400">{r.companyName || r.email}</p>
        </div>
      ),
    },
    { header: 'GST Number', key: 'gstNumber', render: (r) => r.gstNumber || 'N/A' },
    { header: 'Business Type', key: 'businessType', render: (r) => r.businessType || 'Pvt Ltd' },
    { header: 'City', key: 'city', render: (r) => r.city || 'N/A' },
    {
      header: 'Status',
      key: 'status',
      render: (r) => (
        <select
          value={r.status || 'ACTIVE'}
          onChange={(e) => handleStatusChange(r.id, e.target.value)}
          className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="SUSPENDED">SUSPENDED</option>
        </select>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setSelectedClient(r);
              setIsDetailDrawerOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedClient(r);
              resetEdit(r);
              setIsEditModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedClient(r);
              setIsDeleteModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Management"
        subtitle="Manage client accounts, GST numbers, business types, and firm assignments"
        actions={
          <button
            onClick={() => {
              resetCreate();
              setIsCreateModalOpen(true);
            }}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by client name, GST, company..."
          className="w-full sm:max-w-xs"
        />

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <DataTable columns={columns} data={clients} isLoading={isLoading} />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={setPage}
        />
      </div>

      {/* Create Client Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add New Client">
        <form onSubmit={handleSubmitCreate(handleCreateClient)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Client Name</label>
              <input
                type="text"
                {...regCreate('clientName', { required: true })}
                placeholder="ABC Pvt Ltd"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                {...regCreate('companyName')}
                placeholder="ABC Private Limited"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                {...regCreate('email', { required: true })}
                placeholder="info@abcpvtltd.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
              <input
                type="text"
                {...regCreate('phone', { required: true })}
                placeholder="9876543210"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GST Number</label>
              <input
                type="text"
                {...regCreate('gstNumber')}
                placeholder="24AAAAA0000A1Z5"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Business Type</label>
              <input
                type="text"
                {...regCreate('businessType')}
                placeholder="Manufacturing / IT"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Client Password</label>
            <input
              type="password"
              {...regCreate('password', { required: true, minLength: 8 })}
              placeholder="Password@123"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg mt-4"
          >
            Create Client Account
          </button>
        </form>
      </Modal>

      {/* Edit Client Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Client Account">
        <form onSubmit={handleSubmitEdit(handleEditClient)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Client Name</label>
              <input
                type="text"
                {...regEdit('clientName', { required: true })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GST Number</label>
              <input
                type="text"
                {...regEdit('gstNumber')}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg mt-4"
          >
            Save Client Changes
          </button>
        </form>
      </Modal>

      {/* Detail Drawer */}
      <Drawer isOpen={isDetailDrawerOpen} onClose={() => setIsDetailDrawerOpen(false)} title="Client Profile">
        {selectedClient && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h3 className="font-bold text-slate-100 text-lg">{selectedClient.clientName}</h3>
              <p className="text-xs text-slate-400">{selectedClient.companyName || selectedClient.email}</p>
              <div className="mt-3">
                <StatusBadge status={selectedClient.status || 'ACTIVE'} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">GST Number</span>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedClient.gstNumber || 'N/A'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Business Type</span>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedClient.businessType || 'Pvt Ltd'}</p>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteClient}
        title="Delete Client Account"
        message={`Are you sure you want to delete client "${selectedClient?.clientName}"?`}
      />
    </div>
  );
};
