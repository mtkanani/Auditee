import React from 'react';
import { Modal } from '../../../components/common/Modal';

export const EditClientModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  handleSubmitEdit,
  handleEditClient,
  regEdit,
  updateClientMutation,
}) => (
  <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Master Client Profile">
    <form onSubmit={handleSubmitEdit(handleEditClient)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Client Name</label>
          <input
            type="text"
            {...regEdit('clientName', { required: true })}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">GST Number</label>
          <input
            type="text"
            {...regEdit('gstNumber')}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 uppercase"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">PAN Number</label>
          <input
            type="text"
            {...regEdit('panNumber')}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 uppercase"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">TAN Number</label>
          <input
            type="text"
            {...regEdit('tanNumber')}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 uppercase"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Outstanding Balance (₹)</label>
          <input
            type="number"
            {...regEdit('outstandingBalance')}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Terms</label>
          <select
            {...regEdit('paymentTerms')}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          >
            <option value="NET_15">NET 15 Days</option>
            <option value="NET_30">NET 30 Days</option>
            <option value="ON_RECEIPT">Due on Receipt</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={updateClientMutation.isPending}
        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {updateClientMutation.isPending ? 'Saving Client Changes...' : 'Save Client Changes'}
      </button>
    </form>
  </Modal>
);
