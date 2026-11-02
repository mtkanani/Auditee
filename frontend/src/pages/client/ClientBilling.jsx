import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { Badge, Button, FilterBar, PageHeader, SearchInput, Select, StatCard, StatusTag, Table } from '../../components/ui';
import { CircleAlert, CircleCheckBig, Clock, CreditCard, FileText, ReceiptIndianRupee } from 'lucide-react';
import { useClientInvoices } from '../../queries/useInvoices';
import { InvoiceDetailModal } from '../../components/invoices/InvoiceDetailModal';
import { ClientPaymentModal } from '../../components/invoices/ClientPaymentModal';
import { dueLabel } from '../../utils/dueDate';
import { inr, shortDate } from '../firm-admin/BillingManagement/format';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'UNPAID', label: 'Unpaid' },
  { value: 'PARTIALLY_PAID', label: 'Partly paid' },
  { value: 'PAID', label: 'Paid' },
  { value: 'OVERDUE', label: 'Overdue' },
];

export const ClientBilling = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Selected modals state
  const [selectedDetailInvoiceId, setSelectedDetailInvoiceId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPayInvoice, setSelectedPayInvoice] = useState(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  const { invoices, pagination, summary, isLoading, error: invoicesError } = useClientInvoices({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    if (invoicesError) {
      toast.error('Failed to load billing invoices.');
    }
  }, [invoicesError]);

  // Server-side totals over every matching invoice, not just this page
  const totalBilled = Number(summary?.totalAmount || 0);
  const totalPaid = Number(summary?.paidAmount || 0);
  const totalOutstanding = Number(summary?.balanceAmount || 0);
  const pendingCount = summary?.pendingCount || 0;

  const handleOpenPayModal = (invoice) => {
    setSelectedPayInvoice(invoice);
    setIsPayModalOpen(true);
  };

  const handleOpenDetailModal = (invoiceId) => {
    setSelectedDetailInvoiceId(invoiceId);
    setIsDetailModalOpen(true);
  };

  const columns = [
    {
      key: 'invoiceNumber',
      header: 'Invoice',
      render: (r) => (
        <div className="space-y-1">
          <p className="font-medium text-fg tabular-nums whitespace-nowrap">{r.invoiceNumber}</p>
          {r.invoiceType === 'PROFORMA' && <Badge tone="neutral">Proforma</Badge>}
        </div>
      ),
    },
    { key: 'issueDate', header: 'Issued', render: (r) => <span className="text-muted tabular-nums">{shortDate(r.issueDate)}</span> },
    {
      key: 'dueDate',
      header: 'Due',
      render: (r) => {
        const due = r.status === 'PAID' || !(r.balanceAmount > 0) ? null : dueLabel(r.dueDate);
        return (
          <div className="space-y-1">
            <p className="text-fg tabular-nums">{shortDate(r.dueDate)}</p>
            {due && <Badge tone={due.tone} dot>{due.text}</Badge>}
          </div>
        );
      },
    },
    { key: 'totalAmount', header: 'Total', align: 'right', render: (r) => <span className="font-medium text-fg tabular-nums">{inr(r.totalAmount)}</span> },
    {
      key: 'balanceAmount',
      header: 'Balance',
      align: 'right',
      render: (r) => (
        <span className={`font-medium tabular-nums ${Number(r.balanceAmount) > 0 ? 'text-danger' : 'text-muted'}`}>{inr(r.balanceAmount)}</span>
      ),
    },
    { key: 'status', header: 'Status', render: (r) => (r.status ? <StatusTag status={r.status} /> : '—') },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-2">
          {r.status !== 'PAID' && (
            <Button size="sm" variant="primary" icon={CreditCard} onClick={() => handleOpenPayModal(r)}>
              Pay
            </Button>
          )}
          <Button size="sm" variant="ghost" icon={FileText} onClick={() => handleOpenDetailModal(r.id)}>
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Billing" description="Your invoices from the firm. Pay online by UPI, card or net banking." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Billed" value={inr(totalBilled)} icon={FileText} tone="accent" />
        <StatCard label="Paid" value={inr(totalPaid)} icon={CircleCheckBig} tone="success" />
        <StatCard label="Outstanding" value={inr(totalOutstanding)} icon={CircleAlert} tone="danger" />
        <StatCard label="Invoices to pay" value={pendingCount} icon={Clock} tone="warning" />
      </div>

      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search invoice number" />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={STATUS_OPTIONS}
          aria-label="Payment status"
          className="sm:w-44"
        />
      </FilterBar>

      <Table
        columns={columns}
        data={invoices}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={ReceiptIndianRupee}
            title={search || statusFilter ? 'No invoices match' : 'No invoices yet'}
            description={search || statusFilter ? 'Try a different number or status.' : 'Invoices from your firm will show up here.'}
          />
        }
        footer={
          (pagination?.totalPages || 1) > 1 && (
            <Pagination
              currentPage={page}
              totalPages={pagination?.totalPages || 1}
              totalRecords={pagination?.totalRecords || 0}
              limit={10}
              onPageChange={setPage}
            />
          )
        }
      />

      {isDetailModalOpen && (
        <InvoiceDetailModal
          invoiceId={selectedDetailInvoiceId}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}

      {isPayModalOpen && (
        <ClientPaymentModal invoice={selectedPayInvoice} isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} />
      )}
    </div>
  );
};

export default ClientBilling;
