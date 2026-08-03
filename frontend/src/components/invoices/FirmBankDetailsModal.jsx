import React, { useState, useEffect } from 'react';
import { X, Landmark, QrCode, Save, ShieldCheck, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoiceService } from '../../services/invoiceService';

export const FirmBankDetailsModal = ({ isOpen, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    branchName: '',
    upiId: '',
    notes: '',
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchBankDetails();
    }
  }, [isOpen]);

  const fetchBankDetails = async () => {
    setLoading(true);
    try {
      const res = await invoiceService.getBankDetails();
      if (res.data) {
        setFormData({
          bankName: res.data.bankName || '',
          accountNumber: res.data.accountNumber || '',
          ifscCode: res.data.ifscCode || '',
          accountHolderName: res.data.accountHolderName || '',
          branchName: res.data.branchName || '',
          upiId: res.data.upiId || '',
          notes: res.data.notes || '',
        });
      }
    } catch (err) {
      toast.error('Failed to load firm bank details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await invoiceService.updateFirmBankDetails(formData);
      toast.success('Firm bank & payment details updated successfully!');
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to update bank details.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-100">Firm Banking & Payment Settings</h3>
              <p className="text-xs text-slate-400">Configure CA Firm bank details & UPI ID for client online payments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading banking settings...</div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* Account Holder Name & Bank Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Account Holder / Beneficiary Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Codelix CA Firm"
                  value={formData.accountHolderName}
                  onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bank Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ICICI Bank"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Account Number & IFSC Code */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bank Account Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 987654321012"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">IFSC Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ICIC0001234"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono uppercase focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Branch Name & UPI ID */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Branch Location</label>
                <input
                  type="text"
                  placeholder="e.g. PNTC Vejalpur, Ahmedabad Main"
                  value={formData.branchName}
                  onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Firm UPI ID / VPA *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. codelix.ca@okicici"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-indigo-500/40 text-indigo-300 font-mono font-bold text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Payment Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Instructions / Notes for Clients</label>
              <textarea
                rows={2}
                placeholder="e.g. Please quote invoice number on all NEFT/RTGS/UPI transfers."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Settings...' : 'Save Bank Details'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FirmBankDetailsModal;
