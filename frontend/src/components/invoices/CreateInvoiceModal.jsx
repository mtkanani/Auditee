import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { FiPlus, FiTrash2, FiDollarSign, FiFileText, FiCalendar, FiBriefcase } from 'react-icons/fi';
import { firmAdminService } from '../../services/firmAdminService';
import { invoiceService } from '../../services/invoiceService';
import toast from 'react-hot-toast';

export const CreateInvoiceModal = ({ isOpen, onClose, onSuccess }) => {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [invoiceType, setInvoiceType] = useState('TAX_INVOICE');
  const [dueDate, setDueDate] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('24-GUJARAT');
  const [isInterState, setIsInterState] = useState(false);
  const [notes, setNotes] = useState('Thank you for your business.');
  const [terms, setTerms] = useState('Payment due within 15 days of invoice issue.');

  // Line items state
  const [items, setItems] = useState([
    { description: 'Statutory Tax Audit & Form 3CD Filing Services', sacCode: '998231', quantity: 1, unitPrice: '15000', gstRate: 18 },
  ]);

  useEffect(() => {
    if (isOpen) {
      firmAdminService.getClients({ limit: 100 }).then((res) => {
        setClients(res.data || res.clients || []);
      });
      // Default due date: 15 days from today
      const target = new Date();
      target.setDate(target.getDate() + 15);
      setDueDate(target.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: 'GST Return Filing (GSTR-3B & GSTR-1)', sacCode: '998222', quantity: 1, unitPrice: '2500', gstRate: 18 },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Live Math Calculations
  const subTotal = items.reduce((acc, curr) => acc + (Number(curr.quantity || 1) * Number(curr.unitPrice || 0)), 0);
  const cgstAmount = isInterState ? 0 : subTotal * 0.09;
  const sgstAmount = isInterState ? 0 : subTotal * 0.09;
  const igstAmount = isInterState ? subTotal * 0.18 : 0;
  const totalAmount = subTotal + cgstAmount + sgstAmount + igstAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId) {
      toast.error('Please select a client');
      return;
    }
    if (!dueDate) {
      toast.error('Please select a due date');
      return;
    }

    try {
      const payload = {
        clientId: parseInt(clientId, 10),
        invoiceType,
        dueDate,
        placeOfSupply,
        isInterState,
        items,
        notes,
        terms,
      };

      await invoiceService.createInvoice(payload);
      toast.success(`${invoiceType === 'PROFORMA' ? 'Proforma' : 'Tax'} Invoice generated successfully!`);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to generate invoice');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create GST Tax / Proforma Invoice 🧾" maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Header Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Client *</label>
            <select
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-semibold"
            >
              <option value="">Select Client...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName || c.clientName} ({c.gstNumber || 'No GSTIN'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Invoice Type</label>
            <select
              value={invoiceType}
              onChange={(e) => setInvoiceType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-400 font-bold"
            >
              <option value="TAX_INVOICE">Tax Invoice (Official)</option>
              <option value="PROFORMA">Proforma Invoice (Draft Quotation)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Due Date *</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
            />
          </div>
        </div>

        {/* GST State Supply Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <label className="block font-semibold text-slate-400 mb-1">Place of Supply (State Code)</label>
            <input
              type="text"
              value={placeOfSupply}
              onChange={(e) => setPlaceOfSupply(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-bold">
              <input
                type="radio"
                name="gstSupply"
                checked={!isInterState}
                onChange={() => setIsInterState(false)}
              />
              <span>Intra-State (CGST 9% + SGST 9%)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-indigo-400 font-bold">
              <input
                type="radio"
                name="gstSupply"
                checked={isInterState}
                onChange={() => setIsInterState(true)}
              />
              <span>Inter-State (IGST 18%)</span>
            </label>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider">Services Line Items</h4>
            <button
              type="button"
              onClick={handleAddItem}
              className="py-1 px-3 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 text-xs font-bold flex items-center gap-1"
            >
              <FiPlus /> Add Line Item
            </button>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {items.map((item, idx) => {
              const lineAmount = Number(item.quantity || 1) * Number(item.unitPrice || 0);
              return (
                <div key={idx} className="grid grid-cols-12 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 items-center">
                  <div className="col-span-5">
                    <input
                      type="text"
                      required
                      placeholder="Service description..."
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100"
                    />
                  </div>

                  <div className="col-span-2">
                    <select
                      value={item.sacCode}
                      onChange={(e) => handleItemChange(idx, 'sacCode', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-semibold"
                    >
                      <option value="998231">SAC 998231 (Audit)</option>
                      <option value="998222">SAC 998222 (Legal/Tax)</option>
                      <option value="998221">SAC 998221 (Accounting)</option>
                    </select>
                  </div>

                  <div className="col-span-1">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 text-center"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="Price (₹)"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 font-semibold"
                    />
                  </div>

                  <div className="col-span-2 flex items-center justify-between pl-1">
                    <span className="text-xs font-extrabold text-slate-100">₹{lineAmount.toLocaleString('en-IN')}</span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* GST Calculation Summary Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950 border border-indigo-500/20 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal (Excl. Tax):</span>
            <span className="font-bold text-slate-200">₹{subTotal.toLocaleString('en-IN')}</span>
          </div>

          {!isInterState ? (
            <>
              <div className="flex justify-between text-slate-400">
                <span>CGST (9%):</span>
                <span className="font-bold text-indigo-400">+₹{cgstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>SGST (9%):</span>
                <span className="font-bold text-indigo-400">+₹{sgstAmount.toLocaleString('en-IN')}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-slate-400">
              <span>IGST (18%):</span>
              <span className="font-bold text-indigo-400">+₹{igstAmount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-extrabold text-white">
            <span>Total Payable Amount (Incl. GST):</span>
            <span className="text-emerald-400 text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-xl"
        >
          Confirm & Generate Invoice
        </button>
      </form>
    </Modal>
  );
};
