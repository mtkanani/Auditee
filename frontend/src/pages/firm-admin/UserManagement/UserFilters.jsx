import React from 'react';
import { SearchBar } from '../../../components/common/SearchBar';

export const UserFilters = ({ search, setSearch, roleFilter, setRoleFilter, statusFilter, setStatusFilter }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
    <SearchBar
      value={search}
      onChange={setSearch}
      placeholder="Search by name, email, designation..."
      className="w-full sm:max-w-xs"
    />

    <div className="flex items-center gap-3 w-full sm:w-auto">
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
      >
        <option value="">All Roles</option>
        <option value="user">Employee User</option>
        <option value="firm_admin">Firm Admin</option>
      </select>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
      >
        <option value="">All Statuses</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="INACTIVE">INACTIVE</option>
      </select>
    </div>
  </div>
);
