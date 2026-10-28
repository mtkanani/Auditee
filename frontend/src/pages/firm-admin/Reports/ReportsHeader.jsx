import React from 'react';
import { Activity, Printer, Download } from 'lucide-react';

export const ReportsHeader = ({ onPrint, onExportCSV }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/70 border border-slate-800/80 p-6 md:p-8 shadow-2xl">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-bold uppercase tracking-widest mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Enterprise Intelligence Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-fg tracking-tight">
            Firm Analytics & Audit Reports
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl font-medium">
            Real-time insights across billable time, staff performance, revenue growth, invoice collections, and tax compliance filings.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={onPrint}
            className="py-2.5 px-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 text-xs font-bold hover:bg-slate-800 hover:text-fg transition-all flex items-center gap-2 shadow-md hover:shadow-indigo-500/10 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-indigo-400" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={onExportCSV}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
