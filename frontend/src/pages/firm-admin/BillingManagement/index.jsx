import React from 'react';
import { Landmark, Plus, ReceiptText } from 'lucide-react';
import { Pagination } from '../../../components/common/Pagination';
import { EmptyState } from '../../../components/common/EmptyState';
import { CreateInvoiceModal } from '../../../components/invoices/CreateInvoiceModal';
import { InvoiceDetailModal } from '../../../components/invoices/InvoiceDetailModal';
import { FirmBankDetailsModal } from '../../../components/invoices/FirmBankDetailsModal';
import { Button, PageHeader, Table } from '../../../components/ui';
import { useBillingManagement } from './useBillingManagement';
import { getInvoiceColumns } from './invoiceColumns';
import { BillingStats } from './BillingStats';
import { BillingFilters } from './BillingFilters';

export const BillingManagement = () => {
  const view = useBillingManagement();
  const {
    invoices,
    pagination,
    isLoading,
    page,
    setPage,
    openInvoice,
    selectedInvoiceId,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isBankModalOpen,
    setIsBankModalOpen,
  } = view;

  const columns = getInvoiceColumns(view);

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Billing"
        description="GST tax invoices and proformas, payments received and what clients still owe."
        actions={
          <>
            <Button icon={Landmark} onClick={() => setIsBankModalOpen(true)}>
              Bank and payments
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
              New invoice
            </Button>
          </>
        }
      />

      <BillingStats {...view} />

      <BillingFilters {...view} />

      <Table
        columns={columns}
        data={invoices}
        isLoading={isLoading}
        onRowClick={openInvoice}
        emptyState={
          <EmptyState
            icon={ReceiptText}
            title="No invoices found"
            description="Try a different search or filter, or raise your first invoice."
            action={<Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>New invoice</Button>}
          />
        }
        footer={
          <Pagination
            currentPage={page}
            totalPages={pagination?.totalPages || 1}
            totalRecords={pagination?.totalRecords || 0}
            limit={10}
            onPageChange={setPage}
          />
        }
      />

      <FirmBankDetailsModal isOpen={isBankModalOpen} onClose={() => setIsBankModalOpen(false)} />

      <CreateInvoiceModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      <InvoiceDetailModal invoiceId={selectedInvoiceId} isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} />
    </div>
  );
};
