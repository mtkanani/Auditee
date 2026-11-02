import React from 'react';
import { FilterBar, SearchInput, Select } from '../../../components/ui';

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2026, i, 1).toLocaleString('default', { month: 'long' }),
}));
const YEARS = [2025, 2026, 2027].map((y) => ({ value: y, label: String(y) }));

export const AttendanceFilters = ({ isAdmin, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, search, setSearch, selectedUser, setSelectedUser, users }) => (
  <FilterBar>
    <div className="grid grid-cols-2 sm:flex gap-3">
      <Select aria-label="Month" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))} options={MONTHS} className="sm:w-40" />
      <Select aria-label="Year" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))} options={YEARS} className="sm:w-28" />
    </div>
    {isAdmin && (
      <div className="grid grid-cols-1 sm:flex gap-3 sm:ml-auto w-full sm:w-auto">
        <SearchInput value={search} onChange={setSearch} placeholder="Search employee" className="sm:w-56" />
        <Select aria-label="Employee" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="sm:w-48">
          <option value="">Everyone</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.firstName} {u.lastName}
            </option>
          ))}
        </Select>
      </div>
    )}
  </FilterBar>
);
