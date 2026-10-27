import React from 'react';
import { SearchBar } from '../../../components/common/SearchBar';

export const ClientFilters = ({ search, setSearch, clientTypeFilter, setClientTypeFilter, statusFilter, setStatusFilter }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
    <SearchBar
      value={search}
      onChange={setSearch}
      placeholder="Search client name, GST, PAN, TAN, company, contact person..."
      className="w-full sm:max-w-md"
    />

    <div className="flex items-center gap-3 w-full sm:w-auto">
      <select
        value={clientTypeFilter}
        onChange={(e) => setClientTypeFilter(e.target.value)}
        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
      >
        <option value="">All Client Types</option>
        <option value="INDIVIDUAL">INDIVIDUAL</option>
        <option value="PRIVATE_LIMITED">PVT LTD COMPANY</option>
        <option value="PARTNERSHIP">PARTNERSHIP FIRM</option>
        <option value="LLP">LLP</option>
        <option value="PROPRIETORSHIP">PROPRIETORSHIP</option>
        <option value="TRUST">TRUST / NGO</option>
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
