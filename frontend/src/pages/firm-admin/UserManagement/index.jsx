import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable } from '../../../components/common/DataTable';
import { Pagination } from '../../../components/common/Pagination';
import { ConfirmationModal } from '../../../components/common/ConfirmationModal';
import { Download, UserPlus } from 'lucide-react';
import { useUserManagement } from './useUserManagement';
import { getUserColumns } from './userColumns';
import { UserFilters } from './UserFilters';
import { CreateUserModal } from './CreateUserModal';
import { EditUserModal } from './EditUserModal';
import { UserDetailsDrawer } from './UserDetailsDrawer';
import { ResetPasswordModal } from './ResetPasswordModal';

export const UserManagement = () => {
  const view = useUserManagement();
  const {
    handleExport,
    resetCreate,
    setIsCreateModalOpen,
    users,
    isLoading,
    page,
    totalPages,
    totalRecords,
    setPage,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteUser,
    selectedUser,
  } = view;

  const columns = getUserColumns(view);

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
              <Download className="w-4 h-4"  />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                resetCreate();
                setIsCreateModalOpen(true);
              }}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4"  />
              <span>Add New Employee</span>
            </button>
          </div>
        }
      />

      {/* Filter Bar */}
      <UserFilters {...view} />

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
      <CreateUserModal {...view} />

      {/* Edit User Modal */}
      <EditUserModal {...view} />

      {/* User Details Drawer */}
      <UserDetailsDrawer {...view} />

      {/* Reset Password Modal */}
      <ResetPasswordModal {...view} />

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
