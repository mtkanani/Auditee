import React from 'react';
import { CircleAlert } from 'lucide-react';

export const ContactSection = ({ formData, handleInputChange, isVerified, fieldErrors }) => (
  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
    <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
        3
      </span>
      <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
        Primary Contact & Address Details
      </h3>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Contact Name</label>
        <input
          type="text"
          name="contactPersonName"
          value={formData.contactPersonName}
          onChange={handleInputChange}
          disabled={!isVerified}
          placeholder="Mr. Suresh Patel"
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Designation</label>
        <input
          type="text"
          name="contactPersonDesignation"
          value={formData.contactPersonDesignation}
          onChange={handleInputChange}
          disabled={!isVerified}
          placeholder="Managing Director / CFO"
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile / Phone</label>
        <input
          type="text"
          name="contactPersonPhone"
          value={formData.contactPersonPhone}
          onChange={handleInputChange}
          disabled={!isVerified}
          placeholder="9988776655"
          className={`w-full px-3 py-2 rounded-xl bg-slate-900 border text-xs text-slate-100 disabled:opacity-50 transition-all ${
            fieldErrors.contactPersonPhone || fieldErrors.phone
              ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-950/20 text-rose-200'
              : 'border-slate-800 focus:border-indigo-500'
          }`}
        />
        {(fieldErrors.contactPersonPhone || fieldErrors.phone) && (
          <p className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 mt-1 animate-fadeIn">
            <CircleAlert className="w-3.5 h-3.5 text-rose-400 shrink-0"  />
            <span>{fieldErrors.contactPersonPhone || fieldErrors.phone}</span>
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
        <input
          type="email"
          name="contactPersonEmail"
          value={formData.contactPersonEmail}
          onChange={handleInputChange}
          disabled={!isVerified}
          placeholder="suresh@company.com"
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
        />
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-3 sm:col-span-1">
        <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          disabled={!isVerified}
          placeholder="Ahmedabad"
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
        />
      </div>
      <div className="col-span-3 sm:col-span-1">
        <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          disabled={!isVerified}
          placeholder="Gujarat"
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
        />
      </div>
      <div className="col-span-3 sm:col-span-1">
        <label className="block text-xs font-semibold text-slate-300 mb-1">Pincode</label>
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleInputChange}
          disabled={!isVerified}
          placeholder="380001"
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
        />
      </div>
    </div>
  </div>
);
