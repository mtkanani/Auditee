import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button, Input, Select } from '../../ui';

const SAC_OPTIONS = [
  { value: '998231', label: '998231 · Audit' },
  { value: '998222', label: '998222 · Legal and tax' },
  { value: '998221', label: '998221 · Accounting' },
];

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

/** Editable service lines. On phones each line stacks; from sm up it is one row with column headings. */
export const LineItems = ({ items, handleAddItem, handleRemoveItem, handleItemChange }) => (
  <section className="space-y-3">
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-semibold text-fg">Services</h4>
      <Button size="sm" variant="soft" icon={Plus} onClick={handleAddItem}>
        Add line
      </Button>
    </div>

    <div className="hidden sm:grid grid-cols-12 gap-2 px-3 text-xs font-medium text-subtle">
      <span className="col-span-4">Description</span>
      <span className="col-span-3">SAC code</span>
      <span className="col-span-1 text-center">Qty</span>
      <span className="col-span-2">Price</span>
      <span className="col-span-2 text-right pr-9">Amount</span>
    </div>

    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
      {items.map((item, idx) => {
        const lineAmount = Number(item.quantity || 1) * Number(item.unitPrice || 0);
        const n = idx + 1;
        return (
          <div key={idx} className="grid grid-cols-4 sm:grid-cols-12 gap-2 p-3 rounded-xl border border-line bg-sunken/40 items-center">
            <div className="col-span-4">
              <Input
                aria-label={`Line ${n} description`}
                required
                placeholder="Service description"
                value={item.description}
                onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
              />
            </div>
            <div className="col-span-4 sm:col-span-3">
              <Select
                aria-label={`Line ${n} SAC code`}
                value={item.sacCode}
                onChange={(e) => handleItemChange(idx, 'sacCode', e.target.value)}
                options={SAC_OPTIONS}
              />
            </div>
            <div className="col-span-1">
              <Input
                aria-label={`Line ${n} quantity`}
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                className="px-1 text-center"
              />
            </div>
            <div className="col-span-3 sm:col-span-2">
              <Input
                aria-label={`Line ${n} price in rupees`}
                type="number"
                min="0"
                placeholder="Price (₹)"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
              />
            </div>
            <div className="col-span-4 sm:col-span-2 flex items-center justify-end gap-1">
              <span className="text-sm font-medium text-fg tabular-nums">{inr(lineAmount)}</span>
              {items.length > 1 ? (
                <Button size="icon-sm" variant="ghost" aria-label={`Remove line ${n}`} onClick={() => handleRemoveItem(idx)} className="text-danger">
                  <Trash2 className="w-4 h-4" />
                </Button>
              ) : (
                <span className="w-8" aria-hidden="true" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  </section>
);
