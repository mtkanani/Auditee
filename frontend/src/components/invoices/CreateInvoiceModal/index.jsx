import React from 'react';
import { FileCheck2 } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { Button, Field, Input, Select } from '../../ui';
import { cn } from '../../../lib/cn';
import { useInvoiceForm } from './useInvoiceForm';
import { LineItems } from './LineItems';
import { GstSummary } from './GstSummary';

const TYPE_OPTIONS = [
  { value: 'TAX_INVOICE', label: 'Tax invoice' },
  { value: 'PROFORMA', label: 'Proforma (quotation)' },
];

const SUPPLY_OPTIONS = [
  { inter: false, title: 'Within the state', detail: 'CGST 9% + SGST 9%' },
  { inter: true, title: 'Another state', detail: 'IGST 18%' },
];

export const CreateInvoiceModal = ({ isOpen, onClose, onSuccess }) => {
  const form = useInvoiceForm({ isOpen, onClose, onSuccess });
  const {
    clients,
    clientId,
    setClientId,
    invoiceType,
    setInvoiceType,
    dueDate,
    setDueDate,
    placeOfSupply,
    setPlaceOfSupply,
    isInterState,
    setIsInterState,
    handleSubmit,
    createInvoiceMutation,
  } = form;

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New invoice" maxWidth="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Client" required>
            {(p) => (
              <Select {...p} required value={clientId} onChange={(e) => setClientId(e.target.value)}>
                <option value="">Choose a client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName || c.clientName} ({c.gstNumber || 'No GSTIN'})
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Invoice type">
            {(p) => <Select {...p} value={invoiceType} onChange={(e) => setInvoiceType(e.target.value)} options={TYPE_OPTIONS} />}
          </Field>
          <Field label="Payment due" required>
            {(p) => <Input {...p} type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} />}
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          <Field label="Place of supply" hint="State code and name">
            {(p) => <Input {...p} value={placeOfSupply} onChange={(e) => setPlaceOfSupply(e.target.value)} />}
          </Field>
          <fieldset className="sm:col-span-2 space-y-1.5">
            <legend className="text-sm font-medium text-fg mb-1.5">Client is billed from</legend>
            <div className="grid grid-cols-2 gap-2">
              {SUPPLY_OPTIONS.map((o) => (
                <label
                  key={o.title}
                  className={cn(
                    'flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors',
                    isInterState === o.inter ? 'border-accent bg-accent-soft/50' : 'border-line hover:border-line-strong'
                  )}
                >
                  <input
                    type="radio"
                    name="gstSupply"
                    className="mt-0.5 accent-[var(--accent)]"
                    checked={isInterState === o.inter}
                    onChange={() => setIsInterState(o.inter)}
                  />
                  <span>
                    <span className="block text-sm font-medium text-fg">{o.title}</span>
                    <span className="block text-xs text-muted">{o.detail}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <LineItems {...form} />

        <GstSummary {...form} />

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" icon={FileCheck2} loading={createInvoiceMutation.isPending}>
            {invoiceType === 'PROFORMA' ? 'Create proforma' : 'Create invoice'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
