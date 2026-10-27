import React from 'react';
import { Modal } from '../../../components/common/Modal';

export const ResetPasswordModal = ({
  isResetPasswordOpen,
  setIsResetPasswordOpen,
  selectedUser,
  handleSubmitReset,
  handleResetPassword,
  regReset,
}) => (
  <Modal
    isOpen={isResetPasswordOpen}
    onClose={() => setIsResetPasswordOpen(false)}
    title={`Reset Password for ${selectedUser?.firstName}`}
  >
    <form onSubmit={handleSubmitReset(handleResetPassword)} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
        <input
          type="password"
          {...regReset('newPassword', { required: true, minLength: 8 })}
          placeholder="NewUserPassword@123"
          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg"
      >
        Reset Password
      </button>
    </form>
  </Modal>
);
