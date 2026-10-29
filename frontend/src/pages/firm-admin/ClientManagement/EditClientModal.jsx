import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button, Field, Input, Select } from '../../../components/ui';

/** Quick edit of a client's tax IDs, balance and payment terms. Fields are registered with react-hook-form. */
export const EditClientModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  handleSubmitEdit,
  handleEditClient,
  regEdit,
  updateClientMutation,
}) => (
  <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit client">
    <form onSubmit={handleSubmitEdit(handleEditClient)} className="space-y-4">
      <Field label="Client name" required>
        {(p) => <Input {...p} {...regEdit('clientName', { required: true })} />}
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="GSTIN">
          {(p) => <Input {...p} {...regEdit('gstNumber')} className="uppercase font-mono" placeholder="24ABCDE1234F1Z5" />}
        </Field>
        <Field label="PAN">
          {(p) => <Input {...p} {...regEdit('panNumber')} className="uppercase font-mono" placeholder="ABCDE1234F" />}
        </Field>
        <Field label="TAN">
          {(p) => <Input {...p} {...regEdit('tanNumber')} className="uppercase font-mono" placeholder="AHMA12345B" />}
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Outstanding balance (₹)">
          {(p) => <Input {...p} type="number" {...regEdit('outstandingBalance')} />}
        </Field>
        <Field label="Payment terms">
          {(p) => (
            <Select
              {...p}
              {...regEdit('paymentTerms')}
              options={[
                { value: 'NET_15', label: 'Net 15 days' },
                { value: 'NET_30', label: 'Net 30 days' },
                { value: 'ON_RECEIPT', label: 'Due on receipt' },
              ]}
            />
          )}
        </Field>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
        <Button type="submit" variant="primary" loading={updateClientMutation.isPending}>Save changes</Button>
      </div>
    </form>
  </Modal>
);
