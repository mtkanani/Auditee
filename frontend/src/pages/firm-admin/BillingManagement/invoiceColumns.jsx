import React from 'react';
import { Eye } from 'lucide-react';
import { Badge, Button, StatusTag } from '../../../components/ui';
import { dueLabel } from '../../../utils/dueDate';
import { inr, shortDate } from './format';

export const getInvoiceColumns = ({ openInvoice }) => [
  {
    key: 'invoiceNumber',
    header: 'Invoice',
    render: (r) => (
      <div className="space-y-1">
        <p className="font-medium text-fg tabular-nums">{r.invoiceNumber}</p>
        <Badge tone={r.invoiceType === 'PROFORMA' ? 'neutral' : 'accent'}>
          {r.invoiceType === 'PROFORMA' ? 'Proforma' : 'Tax invoice'}
        </Badge>
      </div>
    ),
  },
  {
    key: 'client',
    header: 'Client',
    render: (r) => (
      <div className="min-w-0">
        <p className="font-medium text-fg truncate max-w-[240px]">{r.client?.companyName || r.client?.clientName}</p>
        <p className="text-xs text-subtle truncate max-w-[240px]">GSTIN {r.client?.gstNumber || 'not added'}</p>
      </div>
    ),
  },
  {
    key: 'dueDate',
    header: 'Due',
    render: (r) => {
      // Only unpaid money is "due"; paid invoices just show the date.
      const due = r.status === 'PAID' || !(r.balanceAmount > 0) ? null : dueLabel(r.dueDate);
      return (
        <div className="space-y-1">
          <p className="text-sm text-fg tabular-nums">{shortDate(r.dueDate)}</p>
          {due && <Badge tone={due.tone} dot>{due.text}</Badge>}
        </div>
      );
    },
  },
  {
    key: 'totalAmount',
    header: 'Amount',
    align: 'right',
    render: (r) => <span className="font-medium text-fg tabular-nums">{inr(r.totalAmount)}</span>,
  },
  {
    key: 'balanceAmount',
    header: 'Outstanding',
    align: 'right',
    render: (r) => (
      <span className={`font-medium tabular-nums ${r.balanceAmount > 0 ? 'text-danger' : 'text-success'}`}>{inr(r.balanceAmount)}</span>
    ),
  },
  { key: 'status', header: 'Status', render: (r) => <StatusTag status={r.status} /> },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (r) => (
      <Button
        size="sm"
        variant="soft"
        icon={Eye}
        onClick={(e) => {
          e.stopPropagation();
          openInvoice(r);
        }}
      >
        View
      </Button>
    ),
  },
];
