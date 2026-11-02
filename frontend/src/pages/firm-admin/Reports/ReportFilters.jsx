import React from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Button, FilterBar, SearchInput, Select, Tabs } from '../../../components/ui';
import { DATE_RANGE_PILLS } from './constants';

export const ReportFilters = ({
  dateRange,
  onDateRangeChange,
  selectedEmployee,
  onEmployeeChange,
  employees = [],
  selectedClient,
  onClientChange,
  clients = [],
  searchQuery,
  onSearchChange,
  onReset,
  onApply,
}) => (
  <FilterBar>
    <div className="w-full space-y-3">
      <Tabs aria-label="Date range" value={dateRange} onChange={onDateRangeChange} items={DATE_RANGE_PILLS.map((p) => ({ value: p.id, label: p.label }))} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3 lg:items-center">
        <Select aria-label="Staff" value={selectedEmployee} onChange={(e) => onEmployeeChange(e.target.value)} className="lg:w-44">
          <option value="">All staff</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
        </Select>
        <Select aria-label="Client" value={selectedClient} onChange={(e) => onClientChange(e.target.value)} className="lg:w-52">
          <option value="">All clients</option>
          {clients.map((cli) => (
            <option key={cli.id} value={cli.id}>
              {cli.clientName || cli.companyName}
            </option>
          ))}
        </Select>
        <SearchInput value={searchQuery} onChange={onSearchChange} placeholder="Search" className="lg:w-56 sm:col-span-2" />
        <div className="flex gap-2 lg:ml-auto">
          <Button variant="ghost" icon={X} onClick={onReset}>Reset</Button>
          <Button variant="soft" icon={RefreshCw} onClick={onApply}>Refresh</Button>
        </div>
      </div>
    </div>
  </FilterBar>
);
