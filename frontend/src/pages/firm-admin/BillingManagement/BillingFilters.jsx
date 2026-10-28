import React from 'react';
import { FilterBar, SearchInput, Select } from '../../../components/ui';

const typeOptions = [
  { value: '', label: 'All invoice types' },
  { value: 'TAX_INVOICE', label: 'Tax invoice' },
  { value: 'PROFORMA', label: 'Proforma' },
];

const statusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'UNPAID', label: 'Unpaid' },
  { value: 'PARTIALLY_PAID', label: 'Partially paid' },
  { value: 'PAID', label: 'Paid' },
  { value: 'OVERDUE', label: 'Overdue' },
];

export const BillingFilters = ({ search, setSearch, typeFilter, setTypeFilter, statusFilter, setStatusFilter }) => (
  <FilterBar>
    <SearchInput value={search} onChange={setSearch} placeholder="Search invoice number or client" className="sm:max-w-md" />
    <div className="grid grid-cols-2 sm:flex gap-3 sm:ml-auto">
      <Select aria-label="Invoice type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} options={typeOptions} className="sm:w-44" />
      <Select aria-label="Payment status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={statusOptions} className="sm:w-44" />
    </div>
  </FilterBar>
);
