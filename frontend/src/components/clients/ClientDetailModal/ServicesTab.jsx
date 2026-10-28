import React from 'react';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { Badge, Button, Field, Input, Select, StatusTag } from '../../ui';

const CATEGORIES = [
  { value: 'TAXATION', label: 'Taxation (GST, income tax)' },
  { value: 'AUDIT', label: 'Statutory audit' },
  { value: 'COMPLIANCE', label: 'ROC and secretarial' },
  { value: 'BOOKKEEPING', label: 'Bookkeeping and payroll' },
  { value: 'CONSULTING', label: 'Consulting' },
];
const CYCLES = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'ANNUALLY', label: 'Annually' },
  { value: 'ONE_TIME', label: 'One-time' },
];
const label = (list, v) => list.find((o) => o.value === v)?.label.split(' (')[0] || v;

export const ServicesTab = ({
  client,
  isAddingService,
  setIsAddingService,
  serviceForm,
  setServiceForm,
  handleAddService,
  handleRemoveService,
}) => {
  const set = (key) => (e) => setServiceForm({ ...serviceForm, [key]: e.target.value });
  const services = client.services || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">Services this client pays for, and on what cycle.</p>
        {!isAddingService && (
          <Button size="sm" variant="soft" icon={Plus} onClick={() => setIsAddingService(true)}>Add service</Button>
        )}
      </div>

      {isAddingService && (
        <form onSubmit={handleAddService} className="rounded-2xl border border-accent/30 bg-accent-soft/40 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Service" required className="lg:col-span-2">
              {(p) => <Input {...p} required placeholder="Monthly GST filing" value={serviceForm.serviceName} onChange={set('serviceName')} />}
            </Field>
            <Field label="Category">
              {(p) => <Select {...p} value={serviceForm.serviceCategory} onChange={set('serviceCategory')} options={CATEGORIES} />}
            </Field>
            <Field label="Billing cycle">
              {(p) => <Select {...p} value={serviceForm.billingFrequency} onChange={set('billingFrequency')} options={CYCLES} />}
            </Field>
            <Field label="Fee (₹)">
              {(p) => <Input {...p} type="number" min="0" placeholder="2500" value={serviceForm.feeAmount} onChange={set('feeAmount')} />}
            </Field>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsAddingService(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save service</Button>
          </div>
        </form>
      )}

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line px-5 py-10 text-center">
          <Layers className="w-6 h-6 text-subtle mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm font-medium text-fg">No services yet</p>
          <p className="text-sm text-muted">Add the work you do for this client to track fees.</p>
        </div>
      ) : (
        <ul className="rounded-2xl border border-line divide-y divide-line overflow-hidden">
          {services.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 hover:bg-hover/50">
              <div className="min-w-0 flex-1 basis-48">
                <p className="text-sm font-medium text-fg truncate">{s.serviceName}</p>
                <p className="text-xs text-subtle">{label(CYCLES, s.billingFrequency)}</p>
              </div>
              <Badge tone="accent">{label(CATEGORIES, s.serviceCategory)}</Badge>
              <span className="text-sm font-medium text-fg tabular-nums w-24 text-right">₹{(s.feeAmount || 0).toLocaleString('en-IN')}</span>
              <StatusTag status={s.status || 'ACTIVE'} />
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label={`Remove ${s.serviceName}`}
                className="hover:text-danger hover:bg-danger-soft"
                onClick={() => handleRemoveService(s.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
