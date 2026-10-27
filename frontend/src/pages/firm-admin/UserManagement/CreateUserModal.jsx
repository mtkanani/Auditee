import React from 'react';
import { Modal } from '../../../components/common/Modal';

export const CreateUserModal = ({ isCreateModalOpen, setIsCreateModalOpen, handleSubmitCreate, handleCreateUser, regCreate }) => (
  <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add New Employee User">
    <form onSubmit={handleSubmitCreate(handleCreateUser)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
          <input
            type="text"
            {...regCreate('firstName', { required: true })}
            placeholder="Rahul"
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
          <input
            type="text"
            {...regCreate('lastName', { required: true })}
            placeholder="Sharma"
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
        <input
          type="email"
          {...regCreate('email', { required: true })}
          placeholder="rahul@cafirm.com"
          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number</label>
          <input
            type="text"
            {...regCreate('mobileNumber', { required: true })}
            placeholder="9876543210"
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
          <input
            type="text"
            {...regCreate('city', { required: true })}
            placeholder="Mumbai"
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Designation</label>
        <input
          type="text"
          {...regCreate('designation')}
          placeholder="Senior Tax Auditor"
          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
        <input
          type="password"
          {...regCreate('password', { required: true, minLength: 8 })}
          placeholder="Password@123"
          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg mt-4"
      >
        Create Employee User
      </button>
    </form>
  </Modal>
);
