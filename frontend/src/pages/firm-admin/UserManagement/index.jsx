import React from 'react';
import { Download, UserPlus, Users } from 'lucide-react';
import { Pagination } from '../../../components/common/Pagination';
import { ConfirmationModal } from '../../../components/common/ConfirmationModal';
import { EmptyState } from '../../../components/common/EmptyState';
import { Button, PageHeader, Table } from '../../../components/ui';
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
    setSelectedUser,
    setIsDetailDrawerOpen,
  } = view;

  const columns = getUserColumns(view);
  const openCreate = () => {
    resetCreate();
    setIsCreateModalOpen(true);
  };
  const addButton = (
    <Button variant="primary" icon={UserPlus} onClick={openCreate}>
      Add member
    </Button>
  );

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="People"
        description="Your firm's staff: their roles, contact details, status and sign-in."
        actions={
          <>
            <Button icon={Download} onClick={handleExport}>Export CSV</Button>
            {addButton}
          </>
        }
      />

      <UserFilters {...view} />

      <Table
        columns={columns}
        data={users}
        isLoading={isLoading}
        onRowClick={(user) => {
          setSelectedUser(user);
          setIsDetailDrawerOpen(true);
        }}
        emptyState={
          <EmptyState
            icon={Users}
            title="No one found"
            description="Try a different search or filter, or add your first team member."
            action={addButton}
          />
        }
        footer={<Pagination currentPage={page} totalPages={totalPages} totalRecords={totalRecords} onPageChange={setPage} />}
      />

      <CreateUserModal {...view} />

      <EditUserModal {...view} />

      <UserDetailsDrawer {...view} />

      <ResetPasswordModal {...view} />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Delete team member"
        message={`Delete "${selectedUser?.firstName} ${selectedUser?.lastName}"?`}
      />
    </div>
  );
};
