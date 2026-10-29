import React from 'react';
import { Columns3, List } from 'lucide-react';
import { FilterBar, SearchInput, Select, Tabs } from '../../../components/ui';
import { stageOptions } from './pipelineStages';

export const LeadControlBar = ({ viewMode, setViewMode, search, setSearch, stageFilter, setStageFilter }) => (
  <FilterBar>
    <Tabs
      aria-label="View"
      value={viewMode}
      onChange={setViewMode}
      items={[
        { value: 'kanban', label: 'Pipeline', icon: Columns3 },
        { value: 'table', label: 'List', icon: List },
      ]}
    />
    <div className="grid grid-cols-1 sm:flex gap-3 sm:ml-auto sm:items-center w-full sm:w-auto">
      <SearchInput value={search} onChange={setSearch} placeholder="Search lead, company, service" className="sm:w-64" />
      <Select
        aria-label="Stage"
        value={stageFilter}
        onChange={(e) => setStageFilter(e.target.value)}
        options={[{ value: '', label: 'All stages' }, ...stageOptions]}
        className="sm:w-44"
      />
    </div>
  </FilterBar>
);
