import React from 'react';
import { Eye, Pen, Trash2 } from 'lucide-react';

export const getClientColumns = ({
  setSelectedClient,
  setIsDetailModalOpen,
  handleStatusChange,
  resetEdit,
  setIsEditModalOpen,
  setIsDeleteModalOpen,
}) => [
  {
    header: 'Client & Company Profile',
    key: 'clientName',
    render: (r) => (
      <div
        onClick={() => {
          setSelectedClient(r);
          setIsDetailModalOpen(true);
        }}
        className="cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-100 group-hover:text-indigo-400 transition-colors">
            {r.clientName}
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300">
            {r.clientType || 'INDIVIDUAL'}
          </span>
        </div>
        <p className="text-xs text-slate-400">{r.companyName || r.email}</p>
      </div>
    ),
  },
  {
    header: 'Tax Identifiers (GST / PAN / TAN)',
    key: 'taxIds',
    render: (r) => (
      <div className="text-xs space-y-0.5 font-mono">
        <p className="text-indigo-400 font-bold">GST: {r.gstNumber || 'Not Reg.'}</p>
        <p className="text-purple-400">PAN: {r.panNumber || 'N/A'}</p>
        {r.tanNumber && <p className="text-emerald-400 text-[10px]">TAN: {r.tanNumber}</p>}
      </div>
    ),
  },
  {
    header: 'Primary Contact Person',
    key: 'contactPerson',
    render: (r) => (
      <div className="text-xs">
        <p className="font-bold text-slate-200">{r.contactPersonName || 'N/A'}</p>
        <p className="text-[10px] text-slate-400">{r.contactPersonPhone || r.phone || 'N/A'}</p>
      </div>
    ),
  },
  {
    header: 'Subscribed Services',
    key: 'services',
    render: (r) => (
      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
        {r.services?.length || 0} Active Services
      </span>
    ),
  },
  {
    header: 'Outstanding Balance',
    key: 'balance',
    render: (r) => (
      <span className={`text-xs font-extrabold ${r.outstandingBalance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
        ₹{(r.outstandingBalance || 0).toLocaleString()}
      </span>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (r) => (
      <select
        value={r.status || 'ACTIVE'}
        onChange={(e) => handleStatusChange(r.id, e.target.value)}
        className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
      >
        <option value="ACTIVE">ACTIVE</option>
        <option value="INACTIVE">INACTIVE</option>
      </select>
    ),
  },
  {
    header: 'Actions',
    key: 'actions',
    render: (r) => (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            setSelectedClient(r);
            setIsDetailModalOpen(true);
          }}
          className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
          title="Open 360 Client Hub"
        >
          <Eye className="w-4 h-4"  />
        </button>
        <button
          onClick={() => {
            setSelectedClient(r);
            resetEdit(r);
            setIsEditModalOpen(true);
          }}
          className="p-2 rounded-xl text-purple-400 hover:bg-purple-500/10 transition-colors"
          title="Edit Profile"
        >
          <Pen className="w-4 h-4"  />
        </button>
        <button
          onClick={() => {
            setSelectedClient(r);
            setIsDeleteModalOpen(true);
          }}
          className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Delete Account"
        >
          <Trash2 className="w-4 h-4"  />
        </button>
      </div>
    ),
  },
];
