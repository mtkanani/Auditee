import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatsCard } from '../../components/common/StatsCard';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CreateInvoiceModal } from '../../components/invoices/CreateInvoiceModal';
import { InvoiceDetailModal } from '../../components/invoices/InvoiceDetailModal';
import {
  FiDollarSign,
  FiFileText,
  FiCheckCircle,
  FiAlertTriangle,
  FiPlus,
  FiPrinter,
  FiMail,
  FiClock,
  FiEye,
} from 'react-icons/fi';
import { invoiceService } from '../../services/invoiceService';
import toast from 'react-hot-toast';

export const BillingManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const res = await invoiceService.getAllInvoices({
        search,
        invoiceType: typeFilter || undefined,
        status: statusFilter || undefined,
      });
      setInvoices(res.data || []);
    } catch (err) {
      toast.error('Failed to load billing & invoices');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [search, typeFilter, statusFilter]);

  // Metrics
  const totalRevenue = invoices.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const totalReceived = invoices.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
  const totalOutstanding = invoices.reduce((acc, curr) => acc + (curr.balanceAmount || 0), 0);
  const overdueCount = invoices.filter((i) => i.status === 'OVERDUE' || (new Date(i.dueDate) < new Date() && i.status !== 'PAID')).length;

  const columns = [
    {
      header: 'Invoice #',
      key: 'invoiceNumber',
      render: (r) => (
        <div
          onClick={() => {
            setSelectedInvoiceId(r.id);
            setIsDetailModalOpen(true);
          }}
          className="cursor-pointer group"
        >
          <span className="font-extrabold text-slate-100 group-hover:text-indigo-400 transition-colors">
            {r.invoiceNumber}
          </span>
          <span className="block text-[10px] text-indigo-400 font-bold">
            {r.invoiceType === 'PROFORMA' ? 'PROFORMA' : 'TAX INVOICE'}
          </span>
        </div>
      ),
    },
    {
      header: 'Client',
      key: 'client',
      render: (r) => (
        <div>
          <p className="font-extrabold text-slate-100">{r.client?.companyName || r.client?.clientName}</p>
          <p className="text-xs text-slate-400">GSTIN: {r.client?.gstNumber || 'N/A'}</p>
        </div>
      ),
    },
    {
      header: 'Due Date',
      key: 'dueDate',
      render: (r) => (
        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
          <FiClock /> {new Date(r.dueDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Total Fee (₹)',
      key: 'totalAmount',
      render: (r) => <span className="font-extrabold text-slate-100">₹{Number(r.totalAmount || 0).toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Outstanding (₹)',
      key: 'balanceAmount',
      render: (r) => (
        <span className={`font-bold ${r.balanceAmount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
          ₹{Number(r.balanceAmount || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (r) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedInvoiceId(r.id);
              setIsDetailModalOpen(true);
            }}
            className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 text-xs font-bold flex items-center gap-1"
          >
            <FiEye /> View PDF
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Invoice Workstation"
        subtitle="Generate Indian GST Invoices (CGST/SGST/IGST, SAC Codes), Proforma Invoices, track Outstanding Receivables, and Print/Email PDF Invoices"
        actions={
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        }
      />

      {/* Top Billing Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard title="Total Revenue Billed" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={FiFileText} color="indigo" />
        <StatsCard title="Received Payments" value={`₹${totalReceived.toLocaleString('en-IN')}`} icon={FiCheckCircle} color="emerald" />
        <StatsCard title="Outstanding Receivables" value={`₹${totalOutstanding.toLocaleString('en-IN')}`} icon={FiDollarSign} color="rose" />
        <StatsCard title="Overdue Invoices" value={overdueCount} icon={FiAlertTriangle} color="amber" />
      </div>

      {/* Control Bar & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <SearchBar value={search} onChange={setSearch} placeholder="Search invoice number, client..." className="w-full sm:w-72" />

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
          >
            <option value="">All Invoice Types</option>
            <option value="TAX_INVOICE">Official Tax Invoice</option>
            <option value="PROFORMA">Proforma Invoice</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
          >
            <option value="">All Payment Statuses</option>
            <option value="UNPAID">UNPAID</option>
            <option value="PARTIALLY_PAID">PARTIALLY PAID</option>
            <option value="PAID">PAID</option>
            <option value="OVERDUE">OVERDUE</option>
          </select>
        </div>
      </div>

      {/* Master Invoice Data Table */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <DataTable columns={columns} data={invoices} isLoading={isLoading} />
      </div>

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchInvoices}
      />

      {/* Invoice Detail / PDF Preview Modal */}
      <InvoiceDetailModal
        invoiceId={selectedInvoiceId}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onRefresh={fetchInvoices}
      />
    </div>
  );
};
