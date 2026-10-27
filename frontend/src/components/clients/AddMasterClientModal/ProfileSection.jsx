import React from 'react';
import { CircleAlert } from 'lucide-react';

export const ProfileSection = ({ formData, handleInputChange, isVerified, fieldErrors }) => (
  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
    <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
      <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
        2
      </span>
      <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
        Entity & Account Profile Details
      </h3>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Client / Display Name *</label>
        <input
          type="text"
          name="clientName"
          value={formData.clientName}
          onChange={handleInputChange}
          disabled={!isVerified}
          placeholder="e.g. Apex Tech Pvt Ltd"
          required
          className={`w-full px-3 py-2 rounded-xl bg-slate-900 border text-xs text-slate-100 disabled:opacity-50 transition-all ${
            fieldErrors.clientName
              ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-950/20 text-rose-200'
              : 'border-slate-800 focus:border-indigo-500'
          }`}
        />
        {fieldErrors.clientName && (
          <p className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 mt-1 animate-fadeIn">
            <CircleAlert className="w-3.5 h-3.5 text-rose-400 shrink-0"  />
            <span>{fieldErrors.clientName}</span>
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Constitution Type *</label>
        <select
          name="clientType"
          value={formData.clientType}
          onChange={handleInputChange}
          disabled={!isVerified}
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
        >
          <option value="INDIVIDUAL">INDIVIDUAL</option>
          <option value="PRIVATE_LIMITED">PRIVATE LIMITED</option>
          <option value="PARTNERSHIP">PARTNERSHIP FIRM</option>
          <option value="LLP">LLP</option>
          <option value="PROPRIETORSHIP">PROPRIETORSHIP</option>
          <option value="TRUST">TRUST / NGO</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Company Legal Name</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          disabled={!isVerified}
          placeholder="Full Legal Name"
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Business Type / Industry</label>
        <input
          type="text"
          name="businessType"
          value={formData.businessType}
          onChange={handleInputChange}
          disabled={!isVerified}
          placeholder="Manufacturing / IT / Services"
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Account Email (Portal Login) *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={!isVerified}
          placeholder="client@gmail.com"
          required
          className={`w-full px-3 py-2 rounded-xl bg-slate-900 border text-xs text-slate-100 disabled:opacity-50 transition-all ${
            fieldErrors.email
              ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-950/20 text-rose-200'
              : 'border-slate-800 focus:border-indigo-500'
          }`}
        />
        {fieldErrors.email && (
          <p className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 mt-1 animate-fadeIn">
            <CircleAlert className="w-3.5 h-3.5 text-rose-400 shrink-0"  />
            <span>{fieldErrors.email}</span>
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          disabled={!isVerified}
          placeholder="Password@123"
          className={`w-full px-3 py-2 rounded-xl bg-slate-900 border text-xs text-slate-100 disabled:opacity-50 transition-all ${
            fieldErrors.password
              ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-950/20 text-rose-200'
              : 'border-slate-800 focus:border-indigo-500'
          }`}
        />
        {fieldErrors.password && (
          <p className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 mt-1 animate-fadeIn">
            <CircleAlert className="w-3.5 h-3.5 text-rose-400 shrink-0"  />
            <span>{fieldErrors.password}</span>
          </p>
        )}
      </div>
    </div>
  </div>
);
