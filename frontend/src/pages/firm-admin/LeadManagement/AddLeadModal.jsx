import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button, Field, Input, Select, Textarea } from '../../../components/ui';

const SOURCE_OPTIONS = [
  { value: 'DIRECT', label: 'Walk-in or direct' },
  { value: 'REFERRAL', label: 'Client referral' },
  { value: 'WEBSITE', label: 'Website or Google' },
  { value: 'COLD_CALL', label: 'Cold call or email' },
];

export const AddLeadModal = ({
  isAddModalOpen,
  setIsAddModalOpen,
  handleAddLeadSubmit,
  leadName,
  setLeadName,
  companyName,
  setCompanyName,
  email,
  setEmail,
  phone,
  setPhone,
  interestedServices,
  setInterestedServices,
  estimatedValue,
  setEstimatedValue,
  source,
  setSource,
  businessType,
  setBusinessType,
  notes,
  setNotes,
  createLeadMutation,
}) => (
  <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add a lead" maxWidth="max-w-2xl">
    <form onSubmit={handleAddLeadSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Contact name" required>
          {(p) => <Input {...p} required placeholder="e.g. Rajesh Kumar" value={leadName} onChange={(e) => setLeadName(e.target.value)} />}
        </Field>
        <Field label="Company">
          {(p) => <Input {...p} placeholder="e.g. Apex Tech Solutions" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />}
        </Field>
        <Field label="Email" required>
          {(p) => <Input {...p} type="email" required placeholder="rajesh@apextech.com" value={email} onChange={(e) => setEmail(e.target.value)} />}
        </Field>
        <Field label="Phone">
          {(p) => <Input {...p} placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />}
        </Field>
        <Field label="Interested in">
          {(p) => (
            <Input {...p} placeholder="e.g. GST registration, tax audit" value={interestedServices} onChange={(e) => setInterestedServices(e.target.value)} />
          )}
        </Field>
        <Field label="Estimated value (₹)">
          {(p) => <Input {...p} type="number" placeholder="e.g. 45000" value={estimatedValue} onChange={(e) => setEstimatedValue(e.target.value)} />}
        </Field>
        <Field label="Source">
          {(p) => <Select {...p} value={source} onChange={(e) => setSource(e.target.value)} options={SOURCE_OPTIONS} />}
        </Field>
        <Field label="Business type">
          {(p) => <Input {...p} placeholder="e.g. Pvt Ltd, LLP, proprietorship" value={businessType} onChange={(e) => setBusinessType(e.target.value)} />}
        </Field>
      </div>

      <Field label="Notes">
        {(p) => <Textarea {...p} rows={2} placeholder="What they need, timeline, budget" value={notes} onChange={(e) => setNotes(e.target.value)} />}
      </Field>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
        <Button type="submit" variant="primary" loading={createLeadMutation.isPending}>Add lead</Button>
      </div>
    </form>
  </Modal>
);
