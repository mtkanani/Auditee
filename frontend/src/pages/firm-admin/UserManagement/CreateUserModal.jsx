import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button, Field, Input } from '../../../components/ui';

/** New employee account. Fields are registered with react-hook-form. */
export const CreateUserModal = ({ isCreateModalOpen, setIsCreateModalOpen, handleSubmitCreate, handleCreateUser, regCreate }) => (
  <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add a team member">
    <form onSubmit={handleSubmitCreate(handleCreateUser)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First name" required>
          {(p) => <Input {...p} {...regCreate('firstName', { required: true })} placeholder="Rahul" />}
        </Field>
        <Field label="Last name" required>
          {(p) => <Input {...p} {...regCreate('lastName', { required: true })} placeholder="Sharma" />}
        </Field>
      </div>
      <Field label="Work email" required>
        {(p) => <Input {...p} type="email" {...regCreate('email', { required: true })} placeholder="rahul@cafirm.com" />}
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Mobile" required>
          {(p) => <Input {...p} {...regCreate('mobileNumber', { required: true })} placeholder="9876543210" />}
        </Field>
        <Field label="City" required>
          {(p) => <Input {...p} {...regCreate('city', { required: true })} placeholder="Mumbai" />}
        </Field>
      </div>
      <Field label="Designation">
        {(p) => <Input {...p} {...regCreate('designation')} placeholder="Senior tax auditor" />}
      </Field>
      <Field label="Password" required hint="At least 8 characters.">
        {(p) => <Input {...p} type="password" autoComplete="new-password" {...regCreate('password', { required: true, minLength: 8 })} />}
      </Field>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
        <Button type="submit" variant="primary">Add member</Button>
      </div>
    </form>
  </Modal>
);
