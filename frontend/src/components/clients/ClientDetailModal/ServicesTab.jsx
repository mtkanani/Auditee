import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export const ServicesTab = ({
  client,
  isAddingService,
  setIsAddingService,
  serviceForm,
  setServiceForm,
  handleAddService,
  handleRemoveService,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-bold text-slate-200">Enrolled CA Services & Engagement Terms</h4>
      <button
        onClick={() => setIsAddingService(true)}
        className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
      >
        <Plus size="1em" />
        <span>Add Subscribed Service</span>
      </button>
    </div>

    {/* Add Service Form */}
    {isAddingService && (
      <form onSubmit={handleAddService} className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-4">
        <h5 className="text-xs font-bold text-purple-300 uppercase tracking-wider">New Client Service Details</h5>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            required
            placeholder="Service Name (e.g. Monthly GST Filing)"
            value={serviceForm.serviceName}
            onChange={(e) => setServiceForm({ ...serviceForm, serviceName: e.target.value })}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          />

          <select
            value={serviceForm.serviceCategory}
            onChange={(e) => setServiceForm({ ...serviceForm, serviceCategory: e.target.value })}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="TAXATION">TAXATION (GST / IT)</option>
            <option value="AUDIT">STATUTORY AUDIT</option>
            <option value="COMPLIANCE">ROC / SECRETARIAL</option>
            <option value="BOOKKEEPING">BOOKKEEPING / PAYROLL</option>
            <option value="CONSULTING">CONSULTING</option>
          </select>

          <select
            value={serviceForm.billingFrequency}
            onChange={(e) => setServiceForm({ ...serviceForm, billingFrequency: e.target.value })}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="MONTHLY">MONTHLY</option>
            <option value="QUARTERLY">QUARTERLY</option>
            <option value="ANNUALLY">ANNUALLY</option>
            <option value="ONE_TIME">ONE-TIME</option>
          </select>

          <input
            type="number"
            placeholder="Fee Amount (₹)"
            value={serviceForm.feeAmount}
            onChange={(e) => setServiceForm({ ...serviceForm, feeAmount: e.target.value })}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsAddingService(false)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-semibold"
          >
            Save Service
          </button>
        </div>
      </form>
    )}

    {/* Services Table */}
    <div className="overflow-x-auto rounded-2xl border border-slate-800">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
          <tr>
            <th className="py-3 px-4">Service Name</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4">Billing Cycle</th>
            <th className="py-3 px-4">Fee Amount</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {client.services?.map((s) => (
            <tr key={s.id} className="hover:bg-slate-800/30">
              <td className="py-3.5 px-4 font-bold text-slate-100">{s.serviceName}</td>
              <td className="py-3.5 px-4">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-400 font-semibold">
                  {s.serviceCategory}
                </span>
              </td>
              <td className="py-3.5 px-4 text-slate-300">{s.billingFrequency}</td>
              <td className="py-3.5 px-4 font-bold text-emerald-400">₹{s.feeAmount?.toLocaleString()}</td>
              <td className="py-3.5 px-4">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                  {s.status}
                </span>
              </td>
              <td className="py-3.5 px-4 text-right">
                <button
                  onClick={() => handleRemoveService(s.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                >
                  <Trash2 size="1em" />
                </button>
              </td>
            </tr>
          ))}

          {(!client.services || client.services.length === 0) && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-slate-500">
                No subscribed CA services added yet. Click "Add Subscribed Service" above.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
