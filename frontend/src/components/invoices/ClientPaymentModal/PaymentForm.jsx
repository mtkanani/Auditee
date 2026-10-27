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
    <form onSubmit={handleCompletePayment} className="p-6 overflow-y-auto space-y-5 flex-1">
      {/* Amount Input */}
      <AmountInput {...props} />

      {/* Payment Method Selector */}
      <MethodSelector {...props} />

      {/* TAB 1: UPI / QR CODE */}
      {paymentMethod === 'UPI' && <UpiPanel {...props} />}

      {/* TAB 2: CREDIT / DEBIT CARD */}
      {paymentMethod === 'CARD' && <CardPanel {...props} />}

      {/* TAB 3: NET BANKING */}
      {paymentMethod === 'NET_BANKING' && <NetBankingPanel {...props} />}

      {/* TAB 4: WALLET */}
      {paymentMethod === 'WALLET' && <WalletPanel {...props} />}

      {/* Modal Footer Controls */}
      <PaymentFooter {...props} />
    </form>
  );
};
