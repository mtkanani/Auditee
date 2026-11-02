import React from 'react';
import { User } from 'lucide-react';
import { PickerPanel } from './PickerPanel';

export const UserPanel = ({ filteredUsers, searchUser, setSearchUser, selectedUser, setSelectedUser }) => (
  <PickerPanel
    className="lg:col-span-2"
    icon={User}
    title="Employee"
    hint="Required"
    search={searchUser}
    setSearch={setSearchUser}
    searchLabel="Filter employees"
    selectedId={selectedUser?.id}
    onToggle={(user) => setSelectedUser(selectedUser?.id === user.id ? null : user)}
    items={filteredUsers.map((user) => ({
      ...user,
      title: `${user.firstName} ${user.lastName}`,
      subtitle: user.designation || user.email,
    }))}
  />
);
