import React from 'react';
import { Eye, Key, Pen, Trash2 } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';

export const getUserColumns = ({
  handleStatusChange,
  setSelectedUser,
  setIsDetailDrawerOpen,
  resetEdit,
  setIsEditModalOpen,
  setIsResetPasswordOpen,
  setIsDeleteModalOpen,
}) => [
  {
    header: 'Employee Name',
    key: 'name',
    render: (r) => (
      <div className="flex items-center gap-3">
        <Avatar firstName={r.firstName} lastName={r.lastName} size="sm" />
        <div>
          <p className="font-bold text-slate-100">{r.firstName} {r.lastName}</p>
          <p className="text-xs text-slate-400">{r.email}</p>
        </div>
      </div>
    ),
  },
  { header: 'Mobile', key: 'mobileNumber', render: (r) => r.mobileNumber || r.phone || 'N/A' },
  { header: 'Designation', key: 'designation', render: (r) => r.designation || 'Staff Accountant' },
  {
    header: 'Status',
    key: 'status',
    render: (r) => (
      <select
        value={r.status || 'ACTIVE'}
        onChange={(e) => handleStatusChange(r.id, e.target.value)}
        className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500"
      >
        <option value="ACTIVE">ACTIVE</option>
        <option value="INACTIVE">INACTIVE</option>
        <option value="SUSPENDED">SUSPENDED</option>
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
            setSelectedUser(r);
            setIsDetailDrawerOpen(true);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4"  />
        </button>
        <button
          onClick={() => {
            setSelectedUser(r);
            resetEdit(r);
            setIsEditModalOpen(true);
          }}
          className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
          title="Edit User"
        >
          <Pen className="w-4 h-4"  />
        </button>
        <button
          onClick={() => {
            setSelectedUser(r);
            setIsResetPasswordOpen(true);
          }}
          className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-colors"
          title="Reset Password"
        >
          <Key className="w-4 h-4"  />
        </button>
        <button
          onClick={() => {
            setSelectedUser(r);
            setIsDeleteModalOpen(true);
          }}
          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Delete User"
        >
          <Trash2 className="w-4 h-4"  />
        </button>
      </div>
    ),
  },
];
