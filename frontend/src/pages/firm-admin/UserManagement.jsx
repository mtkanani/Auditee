import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { Pagination } from '../../components/common/Pagination';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Drawer } from '../../components/common/Drawer';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { Avatar } from '../../components/common/Avatar';
import { FiUserPlus, FiEdit2, FiTrash2, FiKey, FiEye, FiDownload, FiCheckCircle } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { firmAdminService } from '../../services/firmAdminService';
import { exportToCsv } from '../../utils/exportToCsv';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

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

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await firmAdminService.getUsers({
        page,
        limit: 10,
        search,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
      });
      setUsers(res.data || res.users || []);
      setTotalPages(res.pagination?.totalPages || 1);
      setTotalRecords(res.pagination?.totalRecords || (res.data ? res.data.length : 0));
    } catch (error) {
      toast.error('Failed to fetch employee users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, statusFilter]);

  const handleCreateUser = async (data) => {
    try {
      await firmAdminService.createUser(data);
      toast.success('Employee User created successfully!');
      setIsCreateModalOpen(false);
      resetCreate();
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to create user.');
    }
  };

  const handleEditUser = async (data) => {
    if (!selectedUser) return;
    try {
      await firmAdminService.updateUser(selectedUser.id, data);
      toast.success('User details updated successfully!');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to update user.');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await firmAdminService.updateUserStatus(userId, newStatus);
      toast.success(`User status changed to ${newStatus}`);
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to update status.');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await firmAdminService.deleteUser(selectedUser.id);
      toast.success('Employee User deleted successfully!');
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to delete user.');
    }
  };

  const handleResetPassword = async (data) => {
    if (!selectedUser) return;
    try {
      await firmAdminService.resetUserPassword(selectedUser.id, data.newPassword);
      toast.success('Password reset successfully!');
      setIsResetPasswordOpen(false);
      resetReset();
    } catch (error) {
      toast.error(error.message || 'Failed to reset password.');
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

  const columns = [
    {
      header: 'Employee Name',
      key: 'name',
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar firstName={r.firstName} lastName={r.lastName} size="sm" />
          <div>
            <p className="font-bold text-slate-100">{r.firstName} {r.lastName}</p>
            <p className="text-xs text-slate-400">{r.email}</p>
          </div>
        </div>
      ),
    },
    { header: 'Mobile', key: 'mobileNumber', render: (r) => r.mobileNumber || r.phone || 'N/A' },
    { header: 'Designation', key: 'designation', render: (r) => r.designation || 'Staff Accountant' },
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
              setSelectedUser(r);
              setIsDetailDrawerOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="View Details"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedUser(r);
              resetEdit(r);
              setIsEditModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
            title="Edit User"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedUser(r);
              setIsResetPasswordOpen(true);
            }}
            className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-colors"
            title="Reset Password"
          >
            <FiKey className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedUser(r);
              setIsDeleteModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete User"
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
        title="User (Employee) Management"
        subtitle="Add, edit, manage and assign roles to your CA firm staff"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                resetCreate();
                setIsCreateModalOpen(true);
              }}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"
            >
              <FiUserPlus className="w-4 h-4" />
              <span>Add New Employee</span>
            </button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email, designation..."
          className="w-full sm:max-w-xs"
        />

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Roles</option>
            <option value="user">Employee User</option>
            <option value="firm_admin">Firm Admin</option>
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

      {/* Table */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <DataTable columns={columns} data={users} isLoading={isLoading} />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={setPage}
        />
      </div>

      {/* Create User Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add New Employee User">
        <form onSubmit={handleSubmitCreate(handleCreateUser)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
              <input
                type="text"
                {...regCreate('firstName', { required: true })}
                placeholder="Rahul"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
              <input
                type="text"
                {...regCreate('lastName', { required: true })}
                placeholder="Sharma"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
            <input
              type="email"
              {...regCreate('email', { required: true })}
              placeholder="rahul@cafirm.com"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number</label>
              <input
                type="text"
                {...regCreate('mobileNumber', { required: true })}
                placeholder="9876543210"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
              <input
                type="text"
                {...regCreate('city', { required: true })}
                placeholder="Mumbai"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Designation</label>
            <input
              type="text"
              {...regCreate('designation')}
              placeholder="Senior Tax Auditor"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
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
            Create Employee User
          </button>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Employee User">
        <form onSubmit={handleSubmitEdit(handleEditUser)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
              <input
                type="text"
                {...regEdit('firstName', { required: true })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
              <input
                type="text"
                {...regEdit('lastName', { required: true })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile</label>
              <input
                type="text"
                {...regEdit('mobileNumber')}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Designation</label>
              <input
                type="text"
                {...regEdit('designation')}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg mt-4"
          >
            Save User Changes
          </button>
        </form>
      </Modal>

      {/* User Details Drawer */}
      <Drawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        title="Employee User Profile"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <Avatar firstName={selectedUser.firstName} lastName={selectedUser.lastName} size="lg" />
              <div>
                <h3 className="font-bold text-slate-100">{selectedUser.firstName} {selectedUser.lastName}</h3>
                <p className="text-xs text-slate-400">{selectedUser.email}</p>
                <div className="mt-2">
                  <StatusBadge status={selectedUser.status || 'ACTIVE'} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Mobile Number</span>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedUser.mobileNumber || selectedUser.phone || 'N/A'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Designation</span>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedUser.designation || 'Staff Accountant'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">City</span>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedUser.city || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Reset Password Modal */}
      <Modal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        title={`Reset Password for ${selectedUser?.firstName}`}
      >
        <form onSubmit={handleSubmitReset(handleResetPassword)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              {...regReset('newPassword', { required: true, minLength: 8 })}
              placeholder="NewUserPassword@123"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg"
          >
            Reset Password
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Delete Employee User"
        message={`Are you sure you want to delete "${selectedUser?.firstName} ${selectedUser?.lastName}"?`}
      />
    </div>
  );
};
