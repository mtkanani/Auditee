import React from 'react';
import { Modal } from '../../common/Modal';
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
      title={invoice ? `${invoice.invoiceType === 'PROFORMA' ? 'PROFORMA' : 'TAX INVOICE'}: ${invoice.invoiceNumber}` : 'Loading Invoice...'}
      maxWidth="max-w-4xl"
    >
      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading Invoice Details...</div>
      ) : invoice ? (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <InvoiceActionToolbar {...detail} />

          {/* Record Payment Form Collapse */}
          {isPaymentFormOpen && <RecordPaymentForm {...detail} />}

          {/* Printable Invoice PDF Sheet Layout */}
          <InvoiceSheet invoice={invoice} />
        </div>
      ) : null}
    </Modal>
  );
};
