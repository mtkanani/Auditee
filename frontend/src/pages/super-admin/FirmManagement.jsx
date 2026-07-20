import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { Pagination } from '../../components/common/Pagination';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { FiPlus, FiEdit2, FiTrash2, FiKey, FiCheckCircle } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { superAdminService } from '../../services/superAdminService';

export const FirmManagement = () => {
  const [firms, setFirms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState(null);

  const { register: regCreate, handleSubmit: handleSubmitCreate, reset: resetCreate } = useForm();
  const { register: regEdit, handleSubmit: handleSubmitEdit, reset: resetEdit } = useForm();
  const { register: regReset, handleSubmit: handleSubmitReset, reset: resetReset } = useForm();

  const fetchFirms = async () => {
    setIsLoading(true);
    try {
      const res = await superAdminService.getAllFirms({
        page,
        limit: 10,
        search,
        status: statusFilter || undefined,
      });
      setFirms(res.data || res.firms || []);
      setTotalPages(res.pagination?.totalPages || 1);
      setTotalRecords(res.pagination?.totalRecords || (res.data ? res.data.length : 0));
    } catch (error) {
      toast.error('Failed to fetch firms');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFirms();
  }, [page, search, statusFilter]);

  const handleCreateFirm = async (data) => {
    try {
      await superAdminService.createFirm(data);
      toast.success('CA Firm created successfully!');
      setIsCreateModalOpen(false);
      resetCreate();
      fetchFirms();
    } catch (error) {
      toast.error(error.message || 'Failed to create firm.');
    }
  };

  const handleEditFirm = async (data) => {
    if (!selectedFirm) return;
    try {
      await superAdminService.updateFirm(selectedFirm.id, data);
      toast.success('Firm updated successfully!');
      setIsEditModalOpen(false);
      fetchFirms();
    } catch (error) {
      toast.error(error.message || 'Failed to update firm.');
    }
  };

  const handleStatusChange = async (firmId, newStatus) => {
    try {
      await superAdminService.updateFirmStatus(firmId, newStatus);
      toast.success(`Firm status updated to ${newStatus}`);
      fetchFirms();
    } catch (error) {
      toast.error(error.message || 'Failed to update status.');
    }
  };

  const handleDeleteFirm = async () => {
    if (!selectedFirm) return;
    try {
      await superAdminService.deleteFirm(selectedFirm.id);
      toast.success('Firm deleted successfully!');
      setIsDeleteModalOpen(false);
      fetchFirms();
    } catch (error) {
      toast.error(error.message || 'Failed to delete firm.');
    }
  };

  const handleResetPassword = async (data) => {
    if (!selectedFirm) return;
    try {
      await superAdminService.resetFirmAdminPassword(selectedFirm.id, data.newPassword);
      toast.success('Firm Admin password reset successfully!');
      setIsResetPasswordOpen(false);
      resetReset();
    } catch (error) {
      toast.error(error.message || 'Failed to reset password.');
    }
  };

  const columns = [
    {
      header: 'Firm Name',
      key: 'firmName',
      render: (r) => (
        <div>
          <p className="font-bold text-slate-100">{r.firmName}</p>
          <p className="text-xs text-slate-400">{r.email}</p>
        </div>
      ),
    },
    { header: 'Phone', key: 'phone' },
    { header: 'City / State', key: 'city', render: (r) => `${r.city || ''}, ${r.state || ''}` },
    {
      header: 'Status',
      key: 'status',
      render: (r) => (
        <select
          value={r.status}
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedFirm(r);
              resetEdit(r);
              setIsEditModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
            title="Edit Firm"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedFirm(r);
              setIsResetPasswordOpen(true);
            }}
            className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-colors"
            title="Reset Admin Password"
          >
            <FiKey className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedFirm(r);
              setIsDeleteModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete Firm"
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
        title="CA Firm Management"
        subtitle="Create, update, monitor and manage tenant CA firms on Auditee"
        actions={
          <button
            onClick={() => {
              resetCreate();
              setIsCreateModalOpen(true);
            }}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create New Firm</span>
          </button>
        }
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search firms by name, email, city..."
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
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <DataTable columns={columns} data={firms} isLoading={isLoading} />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={setPage}
        />
      </div>

      {/* Create Firm Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New CA Firm">
        <form onSubmit={handleSubmitCreate(handleCreateFirm)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Firm Name</label>
            <input
              type="text"
              {...regCreate('firmName', { required: true })}
              placeholder="Apex CA & Associates"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Firm Email</label>
              <input
                type="email"
                {...regCreate('email', { required: true })}
                placeholder="contact@apexca.com"
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
              <input
                type="text"
                {...regCreate('city', { required: true })}
                placeholder="Ahmedabad"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
              <input
                type="text"
                {...regCreate('state', { required: true })}
                placeholder="Gujarat"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Firm Admin Default Password</label>
            <input
              type="password"
              {...regCreate('adminPassword', { required: true, minLength: 8 })}
              placeholder="Password@123"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg mt-4"
          >
            Create Firm
          </button>
        </form>
      </Modal>

      {/* Edit Firm Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Firm Details">
        <form onSubmit={handleSubmitEdit(handleEditFirm)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Firm Name</label>
            <input
              type="text"
              {...regEdit('firmName', { required: true })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
              <input
                type="text"
                {...regEdit('phone')}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
              <input
                type="text"
                {...regEdit('city')}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg mt-4"
          >
            Save Changes
          </button>
        </form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        title={`Reset Admin Password: ${selectedFirm?.firmName}`}
      >
        <form onSubmit={handleSubmitReset(handleResetPassword)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              {...regReset('newPassword', { required: true, minLength: 8 })}
              placeholder="NewAdminPassword@123"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg"
          >
            Reset Admin Password
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteFirm}
        title="Delete CA Firm"
        message={`Are you sure you want to soft delete "${selectedFirm?.firmName}"? All firm users will be logged out.`}
      />
    </div>
  );
};
