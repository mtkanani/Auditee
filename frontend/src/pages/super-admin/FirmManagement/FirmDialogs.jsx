import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../../../components/common/Modal';
import { Button, Field, Input, PasswordInput } from '../../../components/ui';

/** Edit a firm's name, phone and city. form: the page's useForm() for these fields. */
export const EditFirmDialog = ({ isOpen, onClose, form, onSubmit, isSaving }) => {
  const { register, handleSubmit, formState: { errors } } = form;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit firm" maxWidth="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Firm name" required error={errors.firmName && 'Firm name is required'}>
          {(p) => <Input {...p} {...register('firmName', { required: true })} />}
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Phone">{(p) => <Input {...p} type="tel" {...register('phone')} />}</Field>
          <Field label="City">{(p) => <Input {...p} {...register('city')} />}</Field>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isSaving}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

/** Set a new password for a firm's admin account. */
export const ResetAdminPasswordDialog = ({ isOpen, onClose, firm, onSubmit, isSaving }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const submit = async (data) => {
    if (await onSubmit(data)) reset();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reset admin password" maxWidth="max-w-md">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <p className="text-sm text-muted">
          Set a new password for the admin of <strong className="text-fg font-medium">{firm?.firmName}</strong>.
        </p>
        <Field label="New password" required hint="At least 8 characters." error={errors.newPassword && 'Use at least 8 characters'}>
          {(p) => <PasswordInput {...p} autoComplete="new-password" {...register('newPassword', { required: true, minLength: 8 })} />}
        </Field>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isSaving}>
            Reset password
          </Button>
        </div>
      </form>
    </Modal>
  );
};
