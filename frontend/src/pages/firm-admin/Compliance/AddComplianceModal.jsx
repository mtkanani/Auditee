import React from 'react';
import { Modal } from '../../../components/common/Modal';

export const AddComplianceModal = ({
  isAddModalOpen,
  setIsAddModalOpen,
  handleAddCustomSubmit,
  newTitle,
  setNewTitle,
  newCategory,
  setNewCategory,
  newDueDate,
  setNewDueDate,
  newPeriod,
  setNewPeriod,
  newClientId,
  setNewClientId,
  clients,
  newPenalty,
  setNewPenalty,
  createComplianceItemMutation,
}) => (
  <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Custom Compliance Filing">
    <form onSubmit={handleAddCustomSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Filing Item Title *</label>
        <input
          type="text"
          required
          placeholder="e.g. Special Internal GST Reconciliation"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          >
            <option value="GST">GST Returns</option>
            <option value="INCOME_TAX">Income Tax & Audit</option>
            <option value="TDS">TDS Returns</option>
            <option value="ROC_MCA">ROC / MCA</option>
            <option value="PF_ESI">PF & ESI</option>
            <option value="AUDIT">Audit Schedules</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Statutory Due Date *</label>
          <input
            type="date"
            required
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Filing Period</label>
          <input
            type="text"
            placeholder="e.g. Q1 FY 2026-27"
            value={newPeriod}
            onChange={(e) => setNewPeriod(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Client (Optional)</label>
          <select
            value={newClientId}
            onChange={(e) => setNewClientId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          >
            <option value="">All Firm Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.companyName || c.clientName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Late Fee / Penalty Details Note</label>
        <input
          type="text"
          placeholder="e.g. Late fee ₹50/day under Sec 47"
          value={newPenalty}
          onChange={(e) => setNewPenalty(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
        />
      </div>

      <button
        type="submit"
        disabled={createComplianceItemMutation.isPending}
        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg mt-2"
      >
        {createComplianceItemMutation.isPending ? 'Creating...' : 'Create Compliance Item'}
      </button>
    </form>
  </Modal>
);
