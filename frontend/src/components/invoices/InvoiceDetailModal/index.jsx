import React from 'react';
import { Modal } from '../../common/Modal';
import { Skeleton } from '../../common/Skeleton';
import { useInvoiceDetailModal } from './useInvoiceDetailModal';
import { InvoiceActionToolbar } from './InvoiceActionToolbar';
import { RecordPaymentForm } from './RecordPaymentForm';
import { InvoiceSheet } from './InvoiceSheet';

export const InvoiceDetailModal = ({ invoiceId, isOpen, onClose, onRefresh }) => {
  const detail = useInvoiceDetailModal({ invoiceId, isOpen, onRefresh });
  const { invoice, isLoading, isPaymentFormOpen } = detail;

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={invoice ? `${invoice.invoiceType === 'PROFORMA' ? 'Proforma' : 'Tax invoice'} ${invoice.invoiceNumber}` : 'Loading invoice'}
      maxWidth="max-w-4xl"
    >
      {isLoading ? (
        <div className="space-y-4" aria-busy="true">
          <Skeleton className="h-12" />
          <Skeleton className="h-28" />
          <Skeleton className="h-40" />
        </div>
      ) : invoice ? (
        <div className="space-y-5">
          <InvoiceActionToolbar {...detail} />

          {isPaymentFormOpen && <RecordPaymentForm {...detail} />}

          {/* On-screen copy of the invoice; printing uses printInvoice.js */}
          <InvoiceSheet invoice={invoice} />
        </div>
      ) : null}
    </Modal>
  );
};
