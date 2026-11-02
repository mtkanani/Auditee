import React from 'react';
import { AmountInput } from './AmountInput';
import { MethodSelector } from './MethodSelector';
import { UpiPanel } from './UpiPanel';
import { CardPanel } from './CardPanel';
import { NetBankingPanel } from './NetBankingPanel';
import { WalletPanel } from './WalletPanel';
import { PaymentFooter } from './PaymentFooter';

export const PaymentForm = (props) => {
  const { handleCompletePayment, paymentMethod } = props;

  return (
    <form onSubmit={handleCompletePayment} className="space-y-5">
      <AmountInput {...props} />
      <MethodSelector {...props} />

      {paymentMethod === 'UPI' && <UpiPanel {...props} />}
      {paymentMethod === 'CARD' && <CardPanel {...props} />}
      {paymentMethod === 'NET_BANKING' && <NetBankingPanel {...props} />}
      {paymentMethod === 'WALLET' && <WalletPanel {...props} />}

      <PaymentFooter {...props} />
    </form>
  );
};
