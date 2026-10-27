import React from 'react';
import { Modal } from '../../../components/common/Modal';

export const EditUserModal = ({ isEditModalOpen, setIsEditModalOpen, handleSubmitEdit, handleEditUser, regEdit }) => (
  <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Employee User">
    <form onSubmit={handleSubmitEdit(handleEditUser)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
          <input
            type="text"
            {...regEdit('firstName', { required: true })}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
          <input
            type="text"
            {...regEdit('lastName', { required: true })}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile</label>
          <input
            type="text"
            {...regEdit('mobileNumber')}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Designation</label>
          <input
            type="text"
            {...regEdit('designation')}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg mt-4"
      >
        Save User Changes
      </button>
    </form>
  </Modal>
);
