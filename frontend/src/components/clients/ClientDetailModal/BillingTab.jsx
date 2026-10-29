import React from 'react';
import { ReceiptText } from 'lucide-react';
import { StatCard } from '../../ui';
import { InfoItem, Section } from './parts';

const termLabel = { NET_15: 'Net 15 days', NET_30: 'Net 30 days', ON_RECEIPT: 'Due on receipt' };

export const BillingTab = ({ client }) => {
  const due = client.outstandingBalance || 0;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Outstanding" value={`₹${due.toLocaleString('en-IN')}`} tone={due > 0 ? 'danger' : 'success'} />
        <StatCard label="Payment terms" value={termLabel[client.paymentTerms] || client.paymentTerms || 'Net 30 days'} tone="neutral" />
        <StatCard label="GST registration" value={(client.taxRegistrationType || 'REGULAR').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())} tone="neutral" />
      </div>
      <Section title="Billing details" icon={ReceiptText}>
        <dl className="space-y-4">
          <InfoItem label="Billing address" value={client.billingAddress || client.address} />
          <InfoItem label="Fee agreement notes" value={client.billingNotes} />
        </dl>
      </Section>
    </div>
  );
};
