import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { FilterBar, SearchInput, Select, Tabs } from '../../../components/ui';
import { CATEGORIES, STATUSES } from './options';

export const ComplianceFilters = ({
  viewMode,
  setViewMode,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
}) => (
  <FilterBar>
    <Tabs
      aria-label="View"
      value={viewMode}
      onChange={setViewMode}
      items={[
        { value: 'calendar', label: 'Deadlines', icon: LayoutGrid },
        { value: 'table', label: 'List', icon: List },
      ]}
    />
    <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto sm:items-center w-full sm:w-auto">
      <SearchInput value={search} onChange={setSearch} placeholder="Search filing, period, client" className="sm:w-60" />
      <div className="grid grid-cols-2 sm:flex gap-3">
        <Select aria-label="Category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} options={[{ value: '', label: 'All categories' }, ...CATEGORIES]} className="sm:w-48" />
        <Select aria-label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: '', label: 'All statuses' }, ...STATUSES]} className="sm:w-40" />
      </div>
    </div>
  </FilterBar>
);
