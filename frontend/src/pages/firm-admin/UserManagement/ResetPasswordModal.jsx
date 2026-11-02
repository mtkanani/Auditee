import React from 'react';
import { Key } from 'lucide-react';
import { Modal } from '../../../components/common/Modal';
import { Button, Field, Input } from '../../../components/ui';

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
    title={`Reset password for ${selectedUser?.firstName || 'this person'}`}
  >
    <form onSubmit={handleSubmitReset(handleResetPassword)} className="space-y-4">
      <Field label="New password" required hint="At least 8 characters. Share it with them privately.">
        {(p) => <Input {...p} type="password" autoComplete="new-password" {...regReset('newPassword', { required: true, minLength: 8 })} />}
      </Field>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" onClick={() => setIsResetPasswordOpen(false)}>Cancel</Button>
        <Button type="submit" variant="primary" icon={Key}>Reset password</Button>
      </div>
    </form>
  </Modal>
);
