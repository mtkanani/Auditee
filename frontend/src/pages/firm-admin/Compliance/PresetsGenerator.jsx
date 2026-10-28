import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button, Select } from '../../../components/ui';

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2026, i, 1).toLocaleString('en-IN', { month: 'long' }),
}));
const YEARS = [2025, 2026, 2027, 2028].map((y) => ({ value: y, label: String(y) }));

/** One-click statutory due dates (GST, TDS, PF/ESI, tax audit, ROC) for a month. */
export const PresetsGenerator = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  handleGeneratePresets,
  generatePresetsMutation,
}) => (
  <section className="relative overflow-hidden rounded-2xl border border-accent/25 bg-surface p-5 shadow-card">
    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-accent to-accent-2" aria-hidden="true" />
    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent-soft text-accent-fg shrink-0">
          <Sparkles className="w-5 h-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-fg">Generate statutory deadlines</h3>
          <p className="text-sm text-muted">
            Adds the standard GST (11th, 20th), TDS (7th), PF/ESI (15th), tax audit and ROC due dates for the month you pick.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:flex gap-2 sm:items-center">
        <Select aria-label="Month" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))} options={MONTHS} className="sm:w-40" />
        <Select aria-label="Year" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))} options={YEARS} className="sm:w-28" />
        <Button variant="primary" icon={Sparkles} loading={generatePresetsMutation.isPending} onClick={handleGeneratePresets} className="col-span-2 sm:col-span-1">
          Generate
        </Button>
      </div>
    </div>
  </section>
);
