import React from 'react';
import { FilterBar, SearchInput, Select } from '../../../components/ui';

const typeOptions = [
  { value: '', label: 'All client types' },
  { value: 'INDIVIDUAL', label: 'Individual' },
  { value: 'PRIVATE_LIMITED', label: 'Private limited' },
  { value: 'PARTNERSHIP', label: 'Partnership firm' },
  { value: 'LLP', label: 'LLP' },
  { value: 'PROPRIETORSHIP', label: 'Proprietorship' },
  { value: 'TRUST', label: 'Trust or NGO' },
];

const statusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export const ClientFilters = ({ search, setSearch, clientTypeFilter, setClientTypeFilter, statusFilter, setStatusFilter }) => (
  <FilterBar>
    <SearchInput
      value={search}
      onChange={setSearch}
      placeholder="Search name, GSTIN, PAN, contact"
      className="sm:max-w-md"
    />
    <div className="grid grid-cols-2 sm:flex gap-3 sm:ml-auto">
      <Select aria-label="Client type" value={clientTypeFilter} onChange={(e) => setClientTypeFilter(e.target.value)} options={typeOptions} className="sm:w-48" />
      <Select aria-label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={statusOptions} className="sm:w-40" />
    </div>
  </FilterBar>
);
