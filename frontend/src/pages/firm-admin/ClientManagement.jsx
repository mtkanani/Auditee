import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { Pagination } from '../../components/common/Pagination';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatsCard } from '../../components/common/StatsCard';
import { Modal } from '../../components/common/Modal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { ClientDetailModal } from '../../components/clients/ClientDetailModal';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiBriefcase, FiDollarSign, FiLayers, FiShield, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { firmAdminService } from '../../services/firmAdminService';

export const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [clientTypeFilter, setClientTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modals & Drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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
        clientType: clientTypeFilter || undefined,
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
  }, [page, search, clientTypeFilter, statusFilter]);

  const handleCreateClient = async (data) => {
    try {
      await firmAdminService.createClient(data);
      toast.success('Client profile created successfully!');
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

  // Metrics Calculations
  const totalSubscribedServices = clients.reduce((acc, c) => acc + (c.services?.length || 0), 0);
  const totalOutstandingBalance = clients.reduce((acc, c) => acc + (c.outstandingBalance || 0), 0);

  const columns = [
    {
      header: 'Client & Company Profile',
      key: 'clientName',
      render: (r) => (
        <div
          onClick={() => {
            setSelectedClient(r);
            setIsDetailModalOpen(true);
          }}
          className="cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-100 group-hover:text-indigo-400 transition-colors">
              {r.clientName}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300">
              {r.clientType || 'INDIVIDUAL'}
            </span>
          </div>
          <p className="text-xs text-slate-400">{r.companyName || r.email}</p>
        </div>
      ),
    },
    {
      header: 'Tax Identifiers (GST / PAN / TAN)',
      key: 'taxIds',
      render: (r) => (
        <div className="text-xs space-y-0.5 font-mono">
          <p className="text-indigo-400 font-bold">GST: {r.gstNumber || 'Not Reg.'}</p>
          <p className="text-purple-400">PAN: {r.panNumber || 'N/A'}</p>
          {r.tanNumber && <p className="text-emerald-400 text-[10px]">TAN: {r.tanNumber}</p>}
        </div>
      ),
    },
    {
      header: 'Primary Contact Person',
      key: 'contactPerson',
      render: (r) => (
        <div className="text-xs">
          <p className="font-bold text-slate-200">{r.contactPersonName || 'N/A'}</p>
          <p className="text-[10px] text-slate-400">{r.contactPersonPhone || r.phone || 'N/A'}</p>
        </div>
      ),
    },
    {
      header: 'Subscribed Services',
      key: 'services',
      render: (r) => (
        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
          {r.services?.length || 0} Active Services
        </span>
      ),
    },
    {
      header: 'Outstanding Balance',
      key: 'balance',
      render: (r) => (
        <span className={`text-xs font-extrabold ${r.outstandingBalance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
          ₹{(r.outstandingBalance || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (r) => (
        <select
          value={r.status || 'ACTIVE'}
          onChange={(e) => handleStatusChange(r.id, e.target.value)}
          className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
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
              setIsDetailModalOpen(true);
            }}
            className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
            title="Open 360 Client Hub"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedClient(r);
              resetEdit(r);
              setIsEditModalOpen(true);
            }}
            className="p-2 rounded-xl text-purple-400 hover:bg-purple-500/10 transition-colors"
            title="Edit Profile"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedClient(r);
              setIsDeleteModalOpen(true);
            }}
            className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete Account"
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
        title="Client Master Management"
        subtitle="360-degree client hub: Tax Identifiers (PAN, GST, TAN, CIN), Subscribed CA Services, Billing & Master Documents"
        actions={
          <button
            onClick={() => {
              resetCreate();
              setIsCreateModalOpen(true);
            }}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Master Client</span>
          </button>
        }
      />

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Clients"
          value={totalRecords || clients.length}
          icon={FiBriefcase}
          color="indigo"
        />
        <StatsCard
          title="Corporate Accounts"
          value={clients.filter((c) => c.clientType !== 'INDIVIDUAL').length}
          icon={FiShield}
          color="purple"
        />
        <StatsCard
          title="Subscribed Services"
          value={totalSubscribedServices}
          icon={FiLayers}
          color="emerald"
        />
        <StatsCard
          title="Total Outstanding Fees"
          value={`₹${totalOutstandingBalance.toLocaleString()}`}
          icon={FiDollarSign}
          color="rose"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search client name, GST, PAN, TAN, company, contact person..."
          className="w-full sm:max-w-md"
        />

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={clientTypeFilter}
            onChange={(e) => setClientTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Client Types</option>
            <option value="INDIVIDUAL">INDIVIDUAL</option>
            <option value="PRIVATE_LIMITED">PVT LTD COMPANY</option>
            <option value="PARTNERSHIP">PARTNERSHIP FIRM</option>
            <option value="LLP">LLP</option>
            <option value="PROPRIETORSHIP">PROPRIETORSHIP</option>
            <option value="TRUST">TRUST / NGO</option>
          </select>

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
        onRefresh={fetchClients}
      />

      {/* Create Client Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add Master Client Account">
        <form onSubmit={handleSubmitCreate(handleCreateClient)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Section 1: Basic & Entity Info */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">1. Entity & Profile Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Client Name *</label>
                <input
                  type="text"
                  {...regCreate('clientName', { required: true })}
                  placeholder="e.g. ABC Pvt Ltd / Rajesh Sharma"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Client Constitution Type *</label>
                <select
                  {...regCreate('clientType', { required: true })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                >
                  <option value="INDIVIDUAL">INDIVIDUAL</option>
                  <option value="PRIVATE_LIMITED">PRIVATE LIMITED</option>
                  <option value="PARTNERSHIP">PARTNERSHIP FIRM</option>
                  <option value="LLP">LLP</option>
                  <option value="PROPRIETORSHIP">PROPRIETORSHIP</option>
                  <option value="TRUST">TRUST / NGO</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Legal Name</label>
                <input
                  type="text"
                  {...regCreate('companyName')}
                  placeholder="ABC Private Limited"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Business Type / Industry</label>
                <input
                  type="text"
                  {...regCreate('businessType')}
                  placeholder="Manufacturing / IT Consulting"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Account Email *</label>
                <input
                  type="email"
                  {...regCreate('email', { required: true })}
                  placeholder="info@abc.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Portal Password</label>
                <input
                  type="password"
                  {...regCreate('password')}
                  placeholder="Password@123"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Indian Tax Identifiers */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">2. Tax Registration Identifiers</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GST Number (GSTIN)</label>
                <input
                  type="text"
                  {...regCreate('gstNumber')}
                  placeholder="24AAAAA0000A1Z5"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">PAN Number</label>
                <input
                  type="text"
                  {...regCreate('panNumber')}
                  placeholder="ABCDE1234F"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">TAN Number (TDS)</label>
                <input
                  type="text"
                  {...regCreate('tanNumber')}
                  placeholder="ABCD12345E"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">CIN Number (ROC)</label>
                <input
                  type="text"
                  {...regCreate('cinNumber')}
                  placeholder="L00000MH2020PLC000000"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 uppercase"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Primary Contact Person */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">3. Primary Contact Person</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Name</label>
                <input
                  type="text"
                  {...regCreate('contactPersonName')}
                  placeholder="Mr. Suresh Patel"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Designation</label>
                <input
                  type="text"
                  {...regCreate('contactPersonDesignation')}
                  placeholder="Managing Director / CFO"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone / Mobile</label>
                <input
                  type="text"
                  {...regCreate('contactPersonPhone')}
                  placeholder="9988776655"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  {...regCreate('contactPersonEmail')}
                  placeholder="suresh@abc.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg"
          >
            Create Client Master Account
          </button>
        </form>
      </Modal>

      {/* Edit Client Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Master Client Profile">
        <form onSubmit={handleSubmitEdit(handleEditClient)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
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
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">PAN Number</label>
              <input
                type="text"
                {...regEdit('panNumber')}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">TAN Number</label>
              <input
                type="text"
                {...regEdit('tanNumber')}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Outstanding Balance (₹)</label>
              <input
                type="number"
                {...regEdit('outstandingBalance')}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Terms</label>
              <select
                {...regEdit('paymentTerms')}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              >
                <option value="NET_15">NET 15 Days</option>
                <option value="NET_30">NET 30 Days</option>
                <option value="ON_RECEIPT">Due on Receipt</option>
              </select>
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteClient}
        title="Delete Client Master Account"
        message={`Are you sure you want to delete client "${selectedClient?.clientName}"?`}
      />
    </div>
  );
};
