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

  const numberToWords = (num) => {
    const a = [
      '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
      'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    num = Math.floor(Number(num) || 0);
    if (num === 0) return 'Zero Rupees Only';

    const inWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : ' ');
      if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + (n % 100 !== 0 ? inWords(n % 100) : '');
      if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 !== 0 ? inWords(n % 1000) : '');
      if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + (n % 100000 !== 0 ? inWords(n % 100000) : '');
      return inWords(Math.floor(n / 10000000)) + 'Crore ' + (n % 10000000 !== 0 ? inWords(n % 10000000) : '');
    };

    return `${inWords(num).trim()} Rupees Only`;
  };

  const handlePrint = () => {
    if (!invoice) return;

    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) {
      toast.error('Please allow popups to print / download PDF.');
      return;
    }

    const firmName = invoice.firm?.firmName || 'CHARTERED ACCOUNTANTS FIRM';
    const firmAddress = invoice.firm?.address || 'PNTC, vejalpur, Ahmedabad Gujarat';
    const firmGstin = invoice.firm?.gstNumber || '24ABCDE1234F1Z5';
    const firmEmail = invoice.firm?.email || 'codelix@gmail.com';
    const firmPhone = invoice.firm?.phone || '9825621601';

    const clientName = invoice.client?.companyName || invoice.client?.clientName || 'Sharma & co.';
    const clientEmail = invoice.client?.email || 'sharma@gmail.com';
    const clientGstin = invoice.client?.gstNumber || '09AAACH7409R1ZZ';
    const clientPan = invoice.client?.panNumber || 'NOXDJ4514L';

    const itemsRows = (invoice.items || [])
      .map(
        (item, idx) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${idx + 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
            <strong style="color: #0f172a;">${item.description}</strong>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #475569;">${item.sacCode || '998231'}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: bold;">${item.quantity || 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #334155;">₹${Number(item.unitPrice || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #0f172a;">₹${Number(item.amount || 0).toLocaleString('en-IN')}</td>
        </tr>
      `
      )
      .join('');

    const subTotal = Number(invoice.subTotal || 0).toLocaleString('en-IN');
    const cgst = Number(invoice.cgstAmount || 0).toLocaleString('en-IN');
    const sgst = Number(invoice.sgstAmount || 0).toLocaleString('en-IN');
    const igst = Number(invoice.igstAmount || 0).toLocaleString('en-IN');
    const totalAmount = Number(invoice.totalAmount || 0).toLocaleString('en-IN');
    const paidAmount = Number(invoice.paidAmount || 0).toLocaleString('en-IN');
    const balanceAmount = Number(invoice.balanceAmount || 0).toLocaleString('en-IN');
    const amountInWordsStr = numberToWords(invoice.totalAmount || 0);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${invoice.invoiceNumber} - Original Tax Invoice</title>
          <style>
            @page { size: A4; margin: 12mm; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; margin: 0; padding: 25px; font-size: 13px; background: #ffffff; }
            .bill-card { border: 2px solid #1e3a8a; padding: 25px; border-radius: 12px; background: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-bottom: 2px solid #1e3a8a; padding-bottom: 15px; }
            .firm-title { font-size: 24px; font-weight: 900; color: #1e3a8a; text-transform: uppercase; margin: 0; letter-spacing: -0.5px; }
            .inv-title { font-size: 26px; font-weight: 900; color: #1d4ed8; text-align: right; text-transform: uppercase; margin: 0; }
            .details-box { width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; }
            .details-box td { padding: 14px; vertical-align: top; width: 50%; background: #f8fafc; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th { background: #1e3a8a; color: #ffffff; text-transform: uppercase; font-size: 11px; padding: 11px 10px; letter-spacing: 0.5px; }
            .summary-container { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
            .words-box { width: 55%; background: #f1f5f9; padding: 12px 15px; border-radius: 8px; border-left: 4px solid #1d4ed8; font-size: 12px; }
            .totals-table { width: 40%; border-collapse: collapse; }
            .totals-table td { padding: 6px 10px; }
            .grand-total { background: #eff6ff; font-weight: 900; font-size: 15px; color: #1e3a8a; border-top: 2px solid #1d4ed8; border-bottom: 2px solid #1d4ed8; }
            .footer-section { width: 100%; margin-top: 30px; border-top: 1px solid #cbd5e1; pt: 15px; font-size: 11px; color: #64748b; }
            .sign-box { text-align: right; margin-top: 30px; }
            .sign-line { display: inline-block; width: 220px; border-top: 1.5px solid #475569; margin-top: 45px; pt: 6px; font-weight: bold; text-align: center; color: #1e293b; }
            @media print {
              body { padding: 0; }
              .bill-card { border: none; box-shadow: none; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="bill-card">
            <table class="header-table">
              <tr>
                <td style="vertical-align: top;">
                  <h1 class="firm-title">${firmName}</h1>
                  <p style="margin: 4px 0 2px 0; color: #475569; font-weight: 500;">${firmAddress}</p>
                  <p style="margin: 2px 0; color: #334155;">Firm GSTIN: <strong style="color: #0f172a;">${firmGstin}</strong></p>
                  <p style="margin: 2px 0; color: #334155;">Email: <strong>${firmEmail}</strong> ${firmPhone ? `| Phone: <strong>${firmPhone}</strong>` : ''}</p>
                </td>
                <td style="vertical-align: top; text-align: right;">
                  <h2 class="inv-title">${invoice.invoiceType === 'PROFORMA' ? 'PROFORMA INVOICE' : 'TAX INVOICE'}</h2>
                  <p style="font-size: 16px; font-weight: 900; margin: 4px 0; color: #0f172a;">${invoice.invoiceNumber}</p>
                  <p style="margin: 2px 0; color: #475569;">Issue Date: <strong>${new Date(invoice.issueDate).toLocaleDateString('en-IN')}</strong></p>
                  <p style="margin: 2px 0; color: #b91c1c;">Due Date: <strong>${new Date(invoice.dueDate).toLocaleDateString('en-IN')}</strong></p>
                </td>
              </tr>
            </table>

            <table class="details-box">
              <tr>
                <td style="border-right: 1px solid #cbd5e1;">
                  <span style="font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">BILLED TO (CLIENT):</span>
                  <p style="font-size: 15px; font-weight: 900; color: #0f172a; margin: 5px 0 3px 0;">${clientName}</p>
                  <p style="margin: 2px 0; color: #475569;">Email: ${clientEmail}</p>
                  <p style="margin: 2px 0; color: #334155;">Client GSTIN: <strong style="color: #0f172a;">${clientGstin}</strong></p>
                  <p style="margin: 2px 0; color: #334155;">PAN: <strong style="color: #0f172a;">${clientPan}</strong></p>
                </td>
                <td>
                  <span style="font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">SUPPLY DETAILS:</span>
                  <p style="margin: 5px 0 3px 0; color: #334155;">Place of Supply: <strong>${invoice.placeOfSupply || '24-GUJARAT'}</strong></p>
                  <p style="margin: 2px 0; color: #334155;">GST Type: <strong>${invoice.isInterState ? 'Inter-State (IGST)' : 'Intra-State (CGST + SGST)'}</strong></p>
                  <p style="margin: 2px 0; color: #334155;">Payment Status: <strong style="color: ${invoice.status === 'PAID' ? '#16a34a' : '#b91c1c'}; text-transform: uppercase;">${invoice.status}</strong></p>
                </td>
              </tr>
            </table>

            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 6%;">#</th>
                  <th style="width: 44%; text-align: left;">DESCRIPTION OF SERVICES</th>
                  <th style="width: 14%;">SAC CODE</th>
                  <th style="width: 8%;">QTY</th>
                  <th style="width: 14%; text-align: right;">RATE (₹)</th>
                  <th style="width: 14%; text-align: right;">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <div class="summary-container">
              <div class="words-box">
                <span style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase;">AMOUNT IN WORDS:</span>
                <p style="font-size: 13px; font-weight: 800; color: #1e3a8a; margin: 4px 0 0 0;">${amountInWordsStr}</p>
              </div>

              <table class="totals-table">
                <tr>
                  <td style="color: #475569;">Subtotal:</td>
                  <td style="text-align: right; font-weight: bold; color: #0f172a;">₹${subTotal}</td>
                </tr>
                ${
                  !invoice.isInterState
                    ? `
                  <tr>
                    <td style="color: #475569;">CGST (9%):</td>
                    <td style="text-align: right; font-weight: bold; color: #1d4ed8;">+₹${cgst}</td>
                  </tr>
                  <tr>
                    <td style="color: #475569;">SGST (9%):</td>
                    <td style="text-align: right; font-weight: bold; color: #1d4ed8;">+₹${sgst}</td>
                  </tr>
                `
                    : `
                  <tr>
                    <td style="color: #475569;">IGST (18%):</td>
                    <td style="text-align: right; font-weight: bold; color: #1d4ed8;">+₹${igst}</td>
                  </tr>
                `
                }
                <tr class="grand-total">
                  <td>Total Amount:</td>
                  <td style="text-align: right;">₹${totalAmount}</td>
                </tr>
                <tr>
                  <td style="color: #475569;">Paid Amount:</td>
                  <td style="text-align: right; font-weight: bold; color: #16a34a;">₹${paidAmount}</td>
                </tr>
                <tr>
                  <td style="color: #b91c1c; font-weight: bold;">Outstanding Balance:</td>
                  <td style="text-align: right; font-weight: bold; color: #b91c1c;">₹${balanceAmount}</td>
                </tr>
              </table>
            </div>

            <div class="footer-section">
              <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                  <p style="font-weight: bold; color: #0f172a; margin: 0 0 4px 0;">Terms & Conditions:</p>
                  <ol style="margin: 0; padding-left: 18px; color: #64748b; line-height: 1.6;">
                    <li>Payment is due within 15 days of invoice date.</li>
                    <li>Please quote invoice number on all payments and bank transfers.</li>
                    <li>This is an official computer generated Tax Invoice issued by Chartered Accountants Firm.</li>
                  </ol>
                </div>
                <div class="sign-box">
                  <p style="margin: 0; font-weight: bold; color: #0f172a;">For ${firmName}</p>
                  <div class="sign-line">Authorised Signatory</div>
                </div>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
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
