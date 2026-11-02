import React from 'react';
import { CreditCard, Landmark, QrCode, Wallet } from 'lucide-react';
import { cn } from '../../../lib/cn';

const METHODS = [
  { value: 'UPI', label: 'UPI / QR', icon: QrCode },
  { value: 'CARD', label: 'Card', icon: CreditCard },
  { value: 'NET_BANKING', label: 'Bank transfer', icon: Landmark },
  { value: 'WALLET', label: 'Wallet', icon: Wallet },
];

export const MethodSelector = ({ paymentMethod, setPaymentMethod }) => (
  <fieldset>
    <legend className="block text-sm font-medium text-fg mb-2">Payment method</legend>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup">
      {METHODS.map(({ value, label, icon: Icon }) => {
        const active = paymentMethod === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setPaymentMethod(value)}
            className={cn(
              'h-16 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
              active ? 'border-accent bg-accent-soft text-fg' : 'border-line bg-sunken/40 text-muted hover:text-fg hover:border-line-strong'
            )}
          >
            <Icon className={cn('w-5 h-5', active ? 'text-accent-fg' : 'text-subtle')} aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>
  </fieldset>
);
