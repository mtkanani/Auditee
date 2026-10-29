import React from 'react';
import { longDate } from './money';

const Label = ({ children }) => <p className="text-xs font-medium text-subtle mb-1.5">{children}</p>;

export const InvoiceSheetHeader = ({ invoice }) => (
  <>
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-line pb-6">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-fg tracking-tight">{invoice.firm?.firmName || 'CHARTERED ACCOUNTANTS FIRM'}</h2>
        <p className="text-sm text-muted mt-1">
          {invoice.firm?.address ? `${invoice.firm.address}, ` : ''}
          {invoice.firm?.city} {invoice.firm?.state}
        </p>
        <p className="text-sm text-muted">
          GSTIN <span className="font-medium text-fg">{invoice.firm?.gstNumber || '24ABCDE1234F1Z5'}</span>
        </p>
        <p className="text-sm text-muted">{invoice.firm?.email || 'admin@caworkstation.in'}</p>
      </div>

      <div className="sm:text-right shrink-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-fg">
          {invoice.invoiceType === 'PROFORMA' ? 'Proforma invoice' : 'Tax invoice'}
        </p>
        <p className="text-lg font-semibold text-fg tabular-nums mt-1">{invoice.invoiceNumber}</p>
        <p className="text-sm text-muted">Issued {longDate(invoice.issueDate)}</p>
        <p className="text-sm font-medium text-warning">Due {longDate(invoice.dueDate)}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-4 rounded-xl bg-sunken/60 border border-line">
        <Label>Billed to</Label>
        <p className="font-medium text-fg">{invoice.client?.companyName || invoice.client?.clientName}</p>
        <p className="text-sm text-muted">{[invoice.client?.email, invoice.client?.phone].filter(Boolean).join(' · ')}</p>
        <p className="text-sm text-muted">
          GSTIN <span className="font-medium text-fg">{invoice.client?.gstNumber || 'N/A'}</span>
          {' · '}PAN <span className="font-medium text-fg">{invoice.client?.panNumber || 'N/A'}</span>
        </p>
      </div>

      <div className="p-4 rounded-xl bg-sunken/60 border border-line">
        <Label>Supply</Label>
        <p className="text-sm text-muted">
          Place of supply <span className="font-medium text-fg">{invoice.placeOfSupply || '24-GUJARAT'}</span>
        </p>
        <p className="text-sm text-muted">
          GST <span className="font-medium text-fg">{invoice.isInterState ? 'Inter-state (IGST)' : 'Intra-state (CGST + SGST)'}</span>
        </p>
      </div>
    </div>
  </>
);
