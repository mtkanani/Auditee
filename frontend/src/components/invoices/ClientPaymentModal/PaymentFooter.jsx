import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../ui';

export const PaymentFooter = ({ onClose, recordPaymentMutation, amountToPay }) => (
  <div className="pt-4 border-t border-line flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
    <Button type="button" variant="ghost" onClick={onClose}>
      Cancel
    </Button>
    <Button type="submit" variant="primary" iconRight={ArrowRight} loading={recordPaymentMutation.isPending}>
      {recordPaymentMutation.isPending ? 'Recording…' : `Pay ₹${Number(amountToPay || 0).toLocaleString('en-IN')}`}
    </Button>
  </div>
);
