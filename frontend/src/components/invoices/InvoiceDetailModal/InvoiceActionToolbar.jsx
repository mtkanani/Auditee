import React from 'react';
import { IndianRupee, Mail, Printer, Zap } from 'lucide-react';
import { Button, StatusTag } from '../../ui';

export const InvoiceActionToolbar = ({
  invoice,
  handleConvertProforma,
  convertProformaMutation,
  handleSendEmail,
  sendEmailMutation,
  handlePrint,
  isPaymentFormOpen,
  setIsPaymentFormOpen,
}) => (
  <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
    <div className="flex flex-wrap items-center gap-2">
      <StatusTag status={invoice.status} />
      {invoice.invoiceType === 'PROFORMA' && (
        <Button size="sm" variant="soft" icon={Zap} loading={convertProformaMutation.isPending} onClick={handleConvertProforma}>
          Convert to tax invoice
        </Button>
      )}
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" icon={Mail} loading={sendEmailMutation.isPending} onClick={handleSendEmail}>
        Email
      </Button>
      <Button size="sm" icon={Printer} onClick={handlePrint}>
        Print or PDF
      </Button>
      {invoice.status !== 'PAID' && (
        <Button
          size="sm"
          variant="primary"
          icon={IndianRupee}
          aria-expanded={isPaymentFormOpen}
          onClick={() => setIsPaymentFormOpen(!isPaymentFormOpen)}
        >
          Record payment
        </Button>
      )}
    </div>
  </div>
);
