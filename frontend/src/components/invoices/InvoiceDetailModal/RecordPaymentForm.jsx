import React from 'react';
import { Check } from 'lucide-react';
import { Button, Field, Input, Select } from '../../ui';

const MODE_OPTIONS = [
  { value: 'BANK_TRANSFER', label: 'Bank transfer (NEFT/RTGS)' },
  { value: 'UPI', label: 'UPI or QR code' },
  { value: 'CHEQUE', label: 'Cheque' },
  { value: 'CASH', label: 'Cash' },
];

export const RecordPaymentForm = ({
  handleRecordPayment,
  paymentAmount,
  setPaymentAmount,
  paymentMode,
  setPaymentMode,
  refNumber,
  setRefNumber,
  recordPaymentMutation,
}) => (
  <form onSubmit={handleRecordPayment} className="p-4 rounded-2xl border border-success/30 bg-success-soft/40 space-y-4 print:hidden">
    <h4 className="text-sm font-semibold text-fg">Record a payment received</h4>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Field label="Amount (₹)" required>
        {(p) => <Input {...p} type="number" step="0.01" required value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />}
      </Field>
      <Field label="Paid by">
        {(p) => <Select {...p} value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} options={MODE_OPTIONS} />}
      </Field>
      <Field label="Reference">
        {(p) => <Input {...p} placeholder="UTR or cheque number" value={refNumber} onChange={(e) => setRefNumber(e.target.value)} />}
      </Field>
    </div>
    <div className="flex justify-end">
      <Button type="submit" variant="primary" icon={Check} loading={recordPaymentMutation.isPending}>
        Save payment
      </Button>
    </div>
  </form>
);
