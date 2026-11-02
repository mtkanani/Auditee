import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge, Button, Select } from '../../../components/ui';
import { cn } from '../../../lib/cn';

const TYPE_LABELS = {
  INDIVIDUAL: 'Individual',
  PRIVATE_LIMITED: 'Private limited',
  PARTNERSHIP: 'Partnership',
  LLP: 'LLP',
  PROPRIETORSHIP: 'Proprietorship',
  TRUST: 'Trust or NGO',
};
const typeLabel = (t = 'INDIVIDUAL') => TYPE_LABELS[t] || t.toLowerCase().replace(/_/g, ' ');
const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'C';

// Inline controls shouldn't also trigger the row's "open client" click.
const stop = (e) => e.stopPropagation();

export const getClientColumns = ({ handleStatusChange, setSelectedClient, resetEdit, setIsEditModalOpen, setIsDeleteModalOpen }) => [
  {
    key: 'clientName',
    header: 'Client',
    render: (r) => (
      <div className="flex items-center gap-3 min-w-0">
        <span className="grid place-items-center w-9 h-9 rounded-xl bg-accent-soft text-accent-fg text-xs font-semibold shrink-0">
          {initials(r.clientName)}
        </span>
        <div className="min-w-0">
          <p className="font-medium text-fg truncate max-w-[240px]">{r.clientName}</p>
          <p className="text-xs text-subtle truncate max-w-[240px]">
            {typeLabel(r.clientType)}{r.companyName || r.email ? ` · ${r.companyName || r.email}` : ''}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: 'taxIds',
    header: 'GSTIN / PAN',
    render: (r) => (
      <div className="text-sm leading-5">
        <p className={cn('font-mono text-[13px]', r.gstNumber ? 'text-fg' : 'text-subtle')}>{r.gstNumber || 'Not registered'}</p>
        <p className="font-mono text-xs text-subtle">{r.panNumber || '—'}</p>
      </div>
    ),
  },
  {
    key: 'contactPerson',
    header: 'Contact',
    hideOnMobile: true,
    render: (r) => (
      <div className="text-sm leading-5">
        <p className="text-fg">{r.contactPersonName || '—'}</p>
        <p className="text-xs text-subtle">{r.contactPersonPhone || r.phone || ''}</p>
      </div>
    ),
  },
  {
    key: 'services',
    header: 'Services',
    hideOnMobile: true,
    render: (r) => <Badge tone={r.services?.length ? 'accent' : 'neutral'}>{r.services?.length || 0} active</Badge>,
  },
  {
    key: 'balance',
    header: 'Outstanding',
    align: 'right',
    render: (r) => (
      <span className={cn('text-sm font-medium tabular-nums', r.outstandingBalance > 0 ? 'text-danger' : 'text-subtle')}>
        ₹{(r.outstandingBalance || 0).toLocaleString('en-IN')}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (r) => (
      <div onClick={stop} className="w-32">
        <Select
          aria-label={`Status of ${r.clientName}`}
          value={r.status || 'ACTIVE'}
          onChange={(e) => handleStatusChange(r.id, e.target.value)}
          options={[{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }]}
          className="h-8 text-xs"
        />
      </div>
    ),
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (r) => (
      <div onClick={stop} className="flex justify-end gap-1">
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={`Edit ${r.clientName}`}
          onClick={() => {
            setSelectedClient(r);
            resetEdit(r);
            setIsEditModalOpen(true);
          }}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={`Delete ${r.clientName}`}
          className="hover:text-danger hover:bg-danger-soft"
          onClick={() => {
            setSelectedClient(r);
            setIsDeleteModalOpen(true);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];
