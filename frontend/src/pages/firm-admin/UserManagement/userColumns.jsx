import React from 'react';
import { Eye, Key, Pen, Trash2 } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { Button, Select } from '../../../components/ui';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

// Inline controls shouldn't also trigger the row's "open profile" click.
const stop = (e) => e.stopPropagation();

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
    key: 'name',
    header: 'Person',
    render: (r) => (
      <div className="flex items-center gap-3 min-w-0">
        <Avatar firstName={r.firstName} lastName={r.lastName} size="sm" className="shrink-0" />
        <div className="min-w-0">
          <p className="font-medium text-fg truncate max-w-[240px]">{r.firstName} {r.lastName}</p>
          <p className="text-xs text-subtle truncate max-w-[240px]">{r.email}</p>
        </div>
      </div>
    ),
  },
  { key: 'mobileNumber', header: 'Mobile', render: (r) => <span className="text-muted tabular-nums">{r.mobileNumber || r.phone || '—'}</span> },
  { key: 'designation', header: 'Designation', render: (r) => <span className="text-muted">{r.designation || 'Staff Accountant'}</span> },
  {
    key: 'status',
    header: 'Status',
    render: (r) => (
      <div className="w-32" onClick={stop}>
        <Select
          aria-label={`Status of ${r.firstName} ${r.lastName}`}
          value={r.status || 'ACTIVE'}
          onChange={(e) => handleStatusChange(r.id, e.target.value)}
          options={STATUS_OPTIONS}
          className="h-8 text-xs"
        />
      </div>
    ),
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (r) => {
      const name = `${r.firstName} ${r.lastName}`;
      const act = (fn) => (e) => {
        e.stopPropagation();
        setSelectedUser(r);
        fn();
      };
      return (
        <div className="flex justify-end gap-0.5">
          <Button size="icon-sm" variant="ghost" aria-label={`View ${name}`} title="View profile" onClick={act(() => setIsDetailDrawerOpen(true))}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label={`Edit ${name}`}
            title="Edit"
            onClick={act(() => {
              resetEdit(r);
              setIsEditModalOpen(true);
            })}
          >
            <Pen className="w-4 h-4" />
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label={`Reset password for ${name}`} title="Reset password" onClick={act(() => setIsResetPasswordOpen(true))}>
            <Key className="w-4 h-4" />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label={`Delete ${name}`}
            title="Delete"
            onClick={act(() => setIsDeleteModalOpen(true))}
            className="text-danger hover:bg-danger-soft"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
