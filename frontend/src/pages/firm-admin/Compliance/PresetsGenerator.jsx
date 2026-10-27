import React from 'react';
import { Zap } from 'lucide-react';

export const PresetsGenerator = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  handleGeneratePresets,
  generatePresetsMutation,
}) => (
  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
        <Zap className="w-6 h-6"  />
      </div>
      <div>
        <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Indian Statutory Deadlines Generator</h4>
        <p className="text-[11px] text-slate-400">
          1-Click auto-populate statutory GST (11th/20th), TDS (7th/31st), PF/ESI (15th), Tax Audit (30th Sept), and ROC due dates.
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2 w-full sm:w-auto">
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
          <option key={m} value={m}>
            {new Date(2026, m - 1, 1).toLocaleString('default', { month: 'long' })}
          </option>
        ))}
      </select>

      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
      >
        {[2025, 2026, 2027, 2028].map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <button
        onClick={handleGeneratePresets}
        disabled={generatePresetsMutation.isPending}
        className="py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg whitespace-nowrap"
      >
        {generatePresetsMutation.isPending ? 'Generating...' : 'Generate Deadlines'}
      </button>
    </div>
  </div>
);
