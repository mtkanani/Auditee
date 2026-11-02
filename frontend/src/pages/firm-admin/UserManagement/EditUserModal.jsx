import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button, Field, Input } from '../../../components/ui';

export const EditUserModal = ({ isEditModalOpen, setIsEditModalOpen, handleSubmitEdit, handleEditUser, regEdit }) => (
  <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit team member">
    <form onSubmit={handleSubmitEdit(handleEditUser)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First name" required>
          {(p) => <Input {...p} {...regEdit('firstName', { required: true })} />}
        </Field>
        <Field label="Last name" required>
          {(p) => <Input {...p} {...regEdit('lastName', { required: true })} />}
        </Field>
        <Field label="Mobile">
          {(p) => <Input {...p} {...regEdit('mobileNumber')} />}
        </Field>
        <Field label="Designation">
          {(p) => <Input {...p} {...regEdit('designation')} />}
        </Field>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
        <Button type="submit" variant="primary">Save changes</Button>
      </div>
    </form>
  </Modal>
);
