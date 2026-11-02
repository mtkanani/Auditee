import React from 'react';
import { Button, Field } from '../../ui';
import { controlClass } from '../../ui/controlClass';

export const AmountInput = ({ invoice, amountToPay, setAmountToPay }) => (
  <Field label="Amount to pay" hint={`Balance due ₹${Number(invoice.balanceAmount).toLocaleString('en-IN')}`}>
    {(p) => (
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none" aria-hidden="true">
            ₹
          </span>
          <input
            {...p}
            type="number"
            step="0.01"
            min="1"
            max={invoice.balanceAmount}
            required
            inputMode="decimal"
            value={amountToPay}
            onChange={(e) => setAmountToPay(e.target.value)}
            className={`${controlClass(false)} h-11 pl-7 pr-3 text-lg font-semibold tabular-nums`}
          />
        </div>
        <Button type="button" variant="soft" size="sm" onClick={() => setAmountToPay(invoice.balanceAmount)}>
          Full balance
        </Button>
      </div>
    )}
  </Field>
);
