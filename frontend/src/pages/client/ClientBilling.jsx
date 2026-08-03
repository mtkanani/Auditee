import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatsCard } from '../../components/common/StatsCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FiDollarSign, FiClock, FiCheckCircle, FiAlertCircle, FiCreditCard, FiPrinter, FiSearch, FiFileText } from 'react-icons/fi';
import { invoiceService } from '../../services/invoiceService';
import { InvoiceDetailModal } from '../../components/invoices/InvoiceDetailModal';
import { ClientPaymentModal } from '../../components/invoices/ClientPaymentModal';
import toast from 'react-hot-toast';

export const ClientBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected modals state
  const [selectedDetailInvoiceId, setSelectedDetailInvoiceId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPayInvoice, setSelectedPayInvoice] = useState(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  const fetchClientInvoices = async () => {
    setIsLoading(true);
    try {
      const res = await invoiceService.getAllInvoices({
        search,
        status: statusFilter,
      });
      setInvoices(res.data || []);
    } catch (err) {
      toast.error('Failed to load billing invoices.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientInvoices();
  }, [search, statusFilter]);

  // Compute billing summary metrics
  const totalBilled = invoices.reduce((acc, inv) => acc + Number(inv.totalAmount || 0), 0);
  const totalPaid = invoices.reduce((acc, inv) => acc + Number(inv.paidAmount || 0), 0);
  const totalOutstanding = invoices.reduce((acc, inv) => acc + Number(inv.balanceAmount || 0), 0);
  const pendingCount = invoices.filter((inv) => inv.status !== 'PAID').length;

  const handleOpenPayModal = (invoice) => {
    setSelectedPayInvoice(invoice);
    setIsPayModalOpen(true);
  };

  const handleOpenDetailModal = (invoiceId) => {
    setSelectedDetailInvoiceId(invoiceId);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Billing & Online Payments"
        subtitle="View your CA firm tax invoices, track payment status, and make online payments via QR Code, Cards, or NetBanking"
      />

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Billed"
          value={`₹${totalBilled.toLocaleString('en-IN')}`}
          icon={FiFileText}
          color="indigo"
        />
        <StatsCard
          title="Total Paid"
          value={`₹${totalPaid.toLocaleString('en-IN')}`}
          icon={FiCheckCircle}
          color="emerald"
        />
        <StatsCard
          title="Outstanding Balance"
          value={`₹${totalOutstanding.toLocaleString('en-IN')}`}
          icon={FiAlertCircle}
          color="rose"
        />
        <StatsCard
          title="Pending Invoices"
          value={`${pendingCount} Pending`}
          icon={FiClock}
          color="amber"
        />
      </div>

      {/* Filter & Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/60 p-4 border border-slate-800/80 rounded-2xl">
        <div className="relative col-span-2">
          <FiSearch className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by invoice number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Payment Statuses</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="PAID">Fully Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading your invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No billing invoices found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4 text-right">Total (₹)</th>
                  <th className="py-3.5 px-4 text-right">Paid (₹)</th>
                  <th className="py-3.5 px-4 text-right">Balance Due (₹)</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-100">
                      {inv.invoiceNumber}
                      {inv.invoiceType === 'PROFORMA' && (
                        <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">PROFORMA</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(inv.issueDate).toLocaleDateString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium">{new Date(inv.dueDate).toLocaleDateString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-100">₹{Number(inv.totalAmount).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-emerald-400">₹{Number(inv.paidAmount).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-rose-400">₹{Number(inv.balanceAmount).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {inv.status !== 'PAID' && (
                          <button
                            onClick={() => handleOpenPayModal(inv)}
                            className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                          >
                            <FiCreditCard className="w-3.5 h-3.5" />
                            <span>Pay Now</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenDetailModal(inv.id)}
                          className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="View / Print Tax Invoice PDF"
                        >
                          <FiPrinter className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Detail PDF Modal */}
      {isDetailModalOpen && (
        <InvoiceDetailModal
          invoiceId={selectedDetailInvoiceId}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onRefresh={fetchClientInvoices}
        />
      )}

      {/* Interactive Online Payment Modal */}
      {isPayModalOpen && (
        <ClientPaymentModal
          invoice={selectedPayInvoice}
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          onPaymentSuccess={() => {
            fetchClientInvoices();
          }}
        />
      )}
    </div>
  );
};

export default ClientBilling;
