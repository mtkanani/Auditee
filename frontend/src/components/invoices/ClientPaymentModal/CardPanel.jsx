import React from 'react';
import { CreditCard } from 'lucide-react';
import { Field, Input } from '../../ui';

export const CardPanel = ({ cardName, setCardName, cardNumber, setCardNumber, cardExpiry, setCardExpiry, cardCvv, setCardCvv }) => (
  <div className="p-4 rounded-2xl bg-sunken/50 border border-line space-y-4">
    <Field label="Name on card">
      {(p) => <Input {...p} autoComplete="cc-name" value={cardName} onChange={(e) => setCardName(e.target.value)} />}
    </Field>
    <Field label="Card number">
      {(p) => (
        <Input
          {...p}
          icon={CreditCard}
          inputMode="numeric"
          autoComplete="cc-number"
          maxLength={19}
          className="font-mono"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
      )}
    </Field>
    <div className="grid grid-cols-2 gap-3">
      <Field label="Expiry">
        {(p) => (
          <Input
            {...p}
            placeholder="MM/YY"
            maxLength={5}
            autoComplete="cc-exp"
            className="font-mono"
            value={cardExpiry}
            onChange={(e) => setCardExpiry(e.target.value)}
          />
        )}
      </Field>
      <Field label="CVV">
        {(p) => (
          <Input
            {...p}
            type="password"
            inputMode="numeric"
            maxLength={3}
            autoComplete="cc-csc"
            className="font-mono"
            value={cardCvv}
            onChange={(e) => setCardCvv(e.target.value)}
          />
        )}
      </Field>
    </div>
  </div>
);
