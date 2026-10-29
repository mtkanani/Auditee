import React from 'react';
import { KeyRound, Pen, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui';
import { controlClass } from '../../../components/ui/controlClass';

export const FIRM_STATUSES = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

const place = (r) => [r.city, r.state].filter(Boolean).join(', ') || '—';

export const getFirmColumns = ({ onStatusChange, onEdit, onResetPassword, onDelete }) => [
  {
    header: 'Firm',
    key: 'firmName',
    render: (r) => (
      <div className="min-w-0">
        <p className="font-medium text-fg truncate">{r.firmName}</p>
        <p className="text-xs text-muted truncate">{r.email}</p>
      </div>
    ),
  },
  { header: 'Phone', key: 'phone', render: (r) => <span className="text-muted tabular-nums">{r.phone || '—'}</span> },
  { header: 'Location', key: 'city', render: (r) => <span className="text-muted">{place(r)}</span> },
  {
    header: 'Status',
    key: 'status',
    render: (r) => (
      <select
        value={r.status}
        onChange={(e) => onStatusChange(r.id, e.target.value)}
        aria-label={`Status of ${r.firmName}`}
        className={`${controlClass(false)} h-8 w-32 pl-2.5 pr-7 text-xs`}
      >
        {FIRM_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    ),
  },
  {
    header: <span className="sr-only">Actions</span>,
    key: 'actions',
    align: 'right',
    render: (r) => (
      <div className="flex items-center justify-end gap-1">
        <Button size="icon-sm" variant="ghost" icon={Pen} aria-label={`Edit ${r.firmName}`} title="Edit firm" onClick={() => onEdit(r)} />
        <Button
          size="icon-sm"
          variant="ghost"
          icon={KeyRound}
          aria-label={`Reset admin password for ${r.firmName}`}
          title="Reset admin password"
          onClick={() => onResetPassword(r)}
        />
        <Button size="icon-sm" variant="ghost" icon={Trash2} aria-label={`Delete ${r.firmName}`} title="Delete firm" onClick={() => onDelete(r)} />
      </div>
    ),
  },
];
