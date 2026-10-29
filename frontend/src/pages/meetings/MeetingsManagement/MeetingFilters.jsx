import React from 'react';
import { FilterBar, SearchInput, Select } from '../../../components/ui';
import { STATUS_OPTIONS, TYPE_OPTIONS } from './meetingFormat';

export const MeetingFilters = ({ search, setSearch, statusFilter, setStatusFilter, typeFilter, setTypeFilter }) => (
  <FilterBar>
    <SearchInput value={search} onChange={setSearch} placeholder="Search title or agenda" className="sm:max-w-md" />
    <div className="grid grid-cols-2 sm:flex gap-3 sm:ml-auto">
      <Select
        aria-label="Status"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        options={[{ value: '', label: 'All statuses' }, ...STATUS_OPTIONS]}
        className="sm:w-40"
      />
      <Select
        aria-label="Meeting type"
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        options={[{ value: '', label: 'All types' }, ...TYPE_OPTIONS]}
        className="sm:w-44"
      />
    </div>
  </FilterBar>
);
