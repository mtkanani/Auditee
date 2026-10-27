import React from 'react';
import { Modal } from '../../../components/common/Modal';

export const AddLeadModal = ({
  isAddModalOpen,
  setIsAddModalOpen,
  handleAddLeadSubmit,
  leadName,
  setLeadName,
  companyName,
  setCompanyName,
  email,
  setEmail,
  phone,
  setPhone,
  interestedServices,
  setInterestedServices,
  estimatedValue,
  setEstimatedValue,
  source,
  setSource,
  businessType,
  setBusinessType,
  notes,
  setNotes,
  createLeadMutation,
}) => (
  <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Lead (Inquiry)">
    <form onSubmit={handleAddLeadSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Rajesh Kumar"
            value={leadName}
            onChange={(e) => setLeadName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Entity Name</label>
          <input
            type="text"
            placeholder="e.g. Apex Tech Solutions"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
          <input
            type="email"
            required
            placeholder="rajesh@apextech.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
          <input
            type="text"
            placeholder="9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Interested CA Services</label>
          <input
            type="text"
            placeholder="e.g. GST Reg + Tax Audit + Bookkeeping"
            value={interestedServices}
            onChange={(e) => setInterestedServices(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Deal Value (₹)</label>
          <input
            type="number"
            placeholder="e.g. 45000"
            value={estimatedValue}
            onChange={(e) => setEstimatedValue(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Lead Source</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          >
            <option value="DIRECT">Direct Inquiry / Walk-in</option>
            <option value="REFERRAL">Client Referral</option>
            <option value="WEBSITE">Website / Google</option>
            <option value="COLD_CALL">Cold Call / Email</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Business Type</label>
          <input
            type="text"
            placeholder="e.g. Pvt Ltd, LLP, Sole Prop"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Requirement Details</label>
        <textarea
          rows={2}
          placeholder="Client requirement details, timeline..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
        />
      </div>

      <button
        type="submit"
        disabled={createLeadMutation.isPending}
        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg mt-2"
      >
        {createLeadMutation.isPending ? 'Creating Lead...' : 'Create Lead in CRM'}
      </button>
    </form>
  </Modal>
);
