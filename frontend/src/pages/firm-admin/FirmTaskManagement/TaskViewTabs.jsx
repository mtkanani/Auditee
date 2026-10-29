import React from 'react';
import { Inbox, LayoutGrid, List } from 'lucide-react';
import { FilterBar, SearchInput, Select, Tabs } from '../../../components/ui';

const statusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'UNDER_REVIEW', label: 'Under review' },
  { value: 'COMPLETED', label: 'Completed' },
];

/** View switch (board / list / client requests) plus search and status filter. */
export const TaskViewTabs = ({ activeTab, setActiveTab, clientRequests, search, setSearch, statusFilter, setStatusFilter }) => (
  <FilterBar>
    <Tabs
      aria-label="Task views"
      value={activeTab}
      onChange={setActiveTab}
      items={[
        { value: 'kanban', label: 'Board', icon: LayoutGrid },
        { value: 'table', label: 'List', icon: List },
        { value: 'requests', label: 'Client requests', icon: Inbox, count: clientRequests.length },
      ]}
    />
    {activeTab !== 'requests' && (
      <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto sm:items-center w-full sm:w-auto">
        <SearchInput value={search} onChange={setSearch} placeholder="Search tasks" className="sm:w-64" />
        <Select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
          className="sm:w-44"
        />
      </div>
    )}
  </FilterBar>
);
