import React from 'react';
import { FilterBar, SearchInput, Select } from '../../../components/ui';

const roleOptions = [
  { value: '', label: 'All roles' },
  { value: 'user', label: 'Employee' },
  { value: 'firm_admin', label: 'Firm admin' },
];

const statusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export const UserFilters = ({ search, setSearch, roleFilter, setRoleFilter, statusFilter, setStatusFilter }) => (
  <FilterBar>
    <SearchInput value={search} onChange={setSearch} placeholder="Search name, email, designation" className="sm:max-w-md" />
    <div className="grid grid-cols-2 sm:flex gap-3 sm:ml-auto">
      <Select aria-label="Role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} options={roleOptions} className="sm:w-40" />
      <Select aria-label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={statusOptions} className="sm:w-40" />
    </div>
  </FilterBar>
);
