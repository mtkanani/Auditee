import React from 'react';
import { CircleCheckBig } from 'lucide-react';
import { Button } from '../../ui';

const METHOD_LABELS = { UPI: 'UPI', CARD: 'Card', NET_BANKING: 'Bank transfer', WALLET: 'Wallet' };

const Row = ({ label, children }) => (
  <div className="flex justify-between gap-3">
    <dt className="text-muted">{label}</dt>
    <dd className="text-fg font-medium text-right">{children}</dd>
  </div>
);

export const PaymentSuccess = ({ paymentSuccess, onClose }) => (
  <div className="py-4 text-center space-y-4 flex flex-col items-center" role="status">
    <span className="grid place-items-center w-14 h-14 rounded-full bg-success-soft text-success">
      <CircleCheckBig className="w-8 h-8" aria-hidden="true" />
    </span>

    <div>
      <h3 className="text-lg font-semibold text-fg">Payment recorded</h3>
      <p className="text-sm text-muted mt-1">
        Your payment for <strong className="text-fg font-medium">{paymentSuccess.invoiceNumber}</strong> has been logged.
      </p>
    </div>

    <dl className="w-full max-w-sm p-4 rounded-2xl bg-sunken/50 border border-line text-sm space-y-2 text-left">
      <Row label="Reference">
        <span className="font-mono">{paymentSuccess.transactionId}</span>
      </Row>
      <Row label="Amount">₹{paymentSuccess.amountPaid.toLocaleString('en-IN')}</Row>
      <Row label="Method">{METHOD_LABELS[paymentSuccess.method] || paymentSuccess.method}</Row>
      <Row label="When">{paymentSuccess.date}</Row>
    </dl>

    <Button variant="secondary" onClick={onClose}>
      Done
    </Button>
  </div>
);
