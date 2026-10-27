import React from 'react';
import { CreditCard } from 'lucide-react';

export const CardPanel = ({ cardName, setCardName, cardNumber, setCardNumber, cardExpiry, setCardExpiry, cardCvv, setCardCvv }) => (
  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1">Cardholder Name</label>
      <input
        type="text"
        placeholder="e.g. Rahul Sharma"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
      />
    </div>

    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1">Card Number</label>
      <div className="relative">
        <input
          type="text"
          maxLength={19}
          placeholder="4532 •••• •••• 8901"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="w-full pl-3.5 pr-12 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
        />
        <CreditCard className="w-5 h-5 absolute right-3.5 top-2.5 text-slate-500" />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Date</label>
        <input
          type="text"
          placeholder="MM / YY"
          maxLength={5}
          value={cardExpiry}
          onChange={(e) => setCardExpiry(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">CVV / CVC</label>
        <input
          type="password"
          maxLength={3}
          placeholder="•••"
          value={cardCvv}
          onChange={(e) => setCardCvv(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  </div>
);
