import React from 'react';
import { Field, Input } from '../../ui';

export const WalletPanel = ({ walletPhone, setWalletPhone }) => (
  <div className="p-4 rounded-2xl bg-sunken/50 border border-line">
    <Field label="Wallet mobile number" hint="Paytm, MobiKwik or PhonePe wallet.">
      {(p) => <Input {...p} type="tel" autoComplete="tel" value={walletPhone} onChange={(e) => setWalletPhone(e.target.value)} />}
    </Field>
  </div>
);
