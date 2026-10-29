import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button, Field, Input, Select } from '../../../components/ui';
import { CATEGORIES } from './options';

export const AddComplianceModal = ({
  isAddModalOpen,
  setIsAddModalOpen,
  handleAddCustomSubmit,
  newTitle,
  setNewTitle,
  newCategory,
  setNewCategory,
  newDueDate,
  setNewDueDate,
  newPeriod,
  setNewPeriod,
  newClientId,
  setNewClientId,
  clients,
  newPenalty,
  setNewPenalty,
  createComplianceItemMutation,
}) => (
  <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add a filing">
    <form onSubmit={handleAddCustomSubmit} className="space-y-4">
      <Field label="Filing" required>
        {(p) => <Input {...p} required placeholder="Special GST reconciliation" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />}
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Category">
          {(p) => <Select {...p} value={newCategory} onChange={(e) => setNewCategory(e.target.value)} options={CATEGORIES} />}
        </Field>
        <Field label="Due date" required>
          {(p) => <Input {...p} type="date" required value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />}
        </Field>
        <Field label="Period" hint="e.g. Q1 FY 2026-27">
          {(p) => <Input {...p} placeholder="Q1 FY 2026-27" value={newPeriod} onChange={(e) => setNewPeriod(e.target.value)} />}
        </Field>
        <Field label="Client" hint="Leave empty for all clients">
          {(p) => (
            <Select {...p} value={newClientId} onChange={(e) => setNewClientId(e.target.value)}>
              <option value="">All clients</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.companyName || c.clientName}</option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      <Field label="Late fee or penalty note">
        {(p) => <Input {...p} placeholder="₹50 per day under section 47" value={newPenalty} onChange={(e) => setNewPenalty(e.target.value)} />}
      </Field>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
        <Button type="submit" variant="primary" loading={createComplianceItemMutation.isPending}>Add filing</Button>
      </div>
    </form>
  </Modal>
);
