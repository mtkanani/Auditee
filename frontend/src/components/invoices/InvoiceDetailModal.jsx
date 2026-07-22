import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { FiPrinter, FiMail, FiDollarSign, FiZap, FiCheckCircle, FiClock, FiFileText } from 'react-icons/fi';
import { invoiceService } from '../../services/invoiceService';
import toast from 'react-hot-toast';

export const InvoiceDetailModal = ({ invoiceId, isOpen, onClose, onRefresh }) => {
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('BANK_TRANSFER');
  const [refNumber, setRefNumber] = useState('');

  const fetchInvoiceDetails = async () => {
    if (!invoiceId) return;
    setIsLoading(true);
    try {
      const res = await invoiceService.getInvoiceById(invoiceId);
      setInvoice(res.data);
      setPaymentAmount(res.data?.balanceAmount || '');
    } catch (err) {
      toast.error('Failed to load invoice details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && invoiceId) {
      fetchInvoiceDetails();
    }
  }, [isOpen, invoiceId]);

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      toast.error('Valid payment amount required');
      return;
    }
    try {
      await invoiceService.recordPayment(invoiceId, {
        amount: parseFloat(paymentAmount),
        paymentMode,
        referenceNumber: refNumber,
      });
      toast.success('Payment recorded successfully!');
      setIsPaymentFormOpen(false);
      fetchInvoiceDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to record payment');
    }
  };

  const handleConvertProforma = async () => {
    try {
      await invoiceService.convertProforma(invoiceId);
      toast.success('Proforma Invoice converted to Official Tax Invoice!');
      fetchInvoiceDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to convert proforma');
    }
  };

  const handleSendEmail = async () => {
    try {
      await invoiceService.sendInvoiceEmail(invoiceId);
      toast.success(`Invoice emailed to ${invoice.client?.email}!`);
    } catch (err) {
      toast.error(err.message || 'Failed to send email');
    }
  };

  const handlePrint = () => {
    window.print();
  };

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
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Status:</span>
              <StatusBadge status={invoice.status} />
              {invoice.invoiceType === 'PROFORMA' && (
                <button
                  onClick={handleConvertProforma}
                  className="py-1 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-md"
                >
                  <FiZap /> Convert to Tax Invoice
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSendEmail}
                className="py-1.5 px-3 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/20 hover:bg-purple-600/30 text-xs font-bold flex items-center gap-1.5"
              >
                <FiMail /> Send Email
              </button>

              <button
                onClick={handlePrint}
                className="py-1.5 px-3 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5"
              >
                <FiPrinter /> Print / Download PDF
              </button>

              {invoice.status !== 'PAID' && (
                <button
                  onClick={() => setIsPaymentFormOpen(!isPaymentFormOpen)}
                  className="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5"
                >
                  <FiDollarSign /> Record Payment
                </button>
              )}
            </div>
          </div>

          {/* Record Payment Form Collapse */}
          {isPaymentFormOpen && (
            <form onSubmit={handleRecordPayment} className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-3 print:hidden">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <FiDollarSign /> Log Payment Received
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 font-semibold mb-1">Amount Received (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 font-semibold mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                  >
                    <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
                    <option value="UPI">UPI / QR Code</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="CASH">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 font-semibold mb-1">Transaction Ref #</label>
                  <input
                    type="text"
                    placeholder="e.g. UTR / URN 987654"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
              >
                Confirm Payment Entry
              </button>
            </form>
          )}

          {/* Printable Invoice PDF Sheet Layout */}
          <div className="p-8 rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 space-y-6 shadow-2xl print:bg-white print:text-black print:p-0 print:border-none">
            {/* Invoice Top Brand Header */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-6">
              <div>
                <h2 className="text-xl font-black text-indigo-400 tracking-tight">{invoice.firm?.firmName || 'CHARTERED ACCOUNTANTS FIRM'}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  {invoice.firm?.address ? `${invoice.firm.address}, ` : ''}
                  {invoice.firm?.city} {invoice.firm?.state}
                </p>
                <p className="text-xs text-slate-400">Firm GSTIN: <strong className="text-slate-200">{invoice.firm?.gstNumber || '24ABCDE1234F1Z5'}</strong></p>
                <p className="text-xs text-slate-400">Email: {invoice.firm?.email || 'admin@caworkstation.in'}</p>
              </div>

              <div className="text-right">
                <span className="text-xl font-black uppercase text-indigo-400 block">
                  {invoice.invoiceType === 'PROFORMA' ? 'PROFORMA INVOICE' : 'TAX INVOICE'}
                </span>
                <p className="text-sm font-extrabold text-slate-100 mt-1">{invoice.invoiceNumber}</p>
                <p className="text-xs text-slate-400">Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</p>
                <p className="text-xs text-amber-400 font-bold">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Billed To / Client Details */}
            <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-500 block">Billed To (Client):</span>
                <p className="text-sm font-extrabold text-slate-100 mt-1">{invoice.client?.companyName || invoice.client?.clientName}</p>
                <p className="text-xs text-slate-400">{invoice.client?.email} • {invoice.client?.phone}</p>
                <p className="text-xs text-slate-400">GSTIN: <strong className="text-slate-200">{invoice.client?.gstNumber || 'N/A'}</strong></p>
                <p className="text-xs text-slate-400">PAN: <strong className="text-slate-200">{invoice.client?.panNumber || 'N/A'}</strong></p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-500 block">Supply Details:</span>
                <p className="text-xs text-slate-300 mt-1">Place of Supply: <strong>{invoice.placeOfSupply || '24-GUJARAT'}</strong></p>
                <p className="text-xs text-slate-300">GST Type: <strong>{invoice.isInterState ? 'Inter-State (IGST)' : 'Intra-State (CGST + SGST)'}</strong></p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-bold uppercase">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Description of Services</th>
                    <th className="py-2.5 px-3">SAC Code</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price (₹)</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {invoice.items?.map((item, index) => (
                    <tr key={item.id}>
                      <td className="py-2.5 px-3 text-slate-400">{index + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{item.description}</td>
                      <td className="py-2.5 px-3 text-slate-400">{item.sacCode || '998231'}</td>
                      <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right">₹{Number(item.unitPrice).toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-100">
                        ₹{Number(item.amount).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* GST Summary & Totals */}
            <div className="flex justify-end pt-4 border-t border-slate-800">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-200">₹{Number(invoice.subTotal).toLocaleString('en-IN')}</span>
                </div>

                {!invoice.isInterState ? (
                  <>
                    <div className="flex justify-between text-slate-400">
                      <span>CGST (9%):</span>
                      <span className="font-bold text-indigo-400">+₹{Number(invoice.cgstAmount).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>SGST (9%):</span>
                      <span className="font-bold text-indigo-400">+₹{Number(invoice.sgstAmount).toLocaleString('en-IN')}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-slate-400">
                    <span>IGST (18%):</span>
                    <span className="font-bold text-indigo-400">+₹{Number(invoice.igstAmount).toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-slate-100">
                  <span>Total Amount:</span>
                  <span className="text-emerald-400">₹{Number(invoice.totalAmount).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Paid Amount:</span>
                  <span className="font-bold text-emerald-400">₹{Number(invoice.paidAmount).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-xs font-extrabold text-rose-400 pt-1 border-t border-slate-800">
                  <span>Outstanding Balance:</span>
                  <span>₹{Number(invoice.balanceAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Payment Logs History */}
            {invoice.payments?.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-300 block">Recorded Payment History:</span>
                {invoice.payments.map((p) => (
                  <div key={p.id} className="flex justify-between text-slate-400 text-[11px]">
                    <span>{new Date(p.paymentDate).toLocaleDateString()} • {p.paymentMode} ({p.referenceNumber || 'N/A'})</span>
                    <span className="font-bold text-emerald-400">₹{Number(p.amount).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
};
