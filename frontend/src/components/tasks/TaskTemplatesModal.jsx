import React from 'react';
import { Modal } from '../common/Modal';
import { FiZap, FiCheck, FiLayers } from 'react-icons/fi';

const PRESET_TEMPLATES = [
  {
    title: 'GSTR-3B Monthly Tax Return Filing',
    category: 'TAXATION (GST)',
    priority: 'HIGH',
    description: 'Monthly summary tax return filing after reconciliation of GSTR-2B purchase input tax credit.',
    subtasks: [
      'Download and reconcile GSTR-2B with Purchase Register',
      'Compute Net Tax Liability (CGST + SGST + IGST)',
      'Generate GSTR-3B summary preview and send to client',
      'File GSTR-3B return on GST Portal with EVC/DSC',
    ],
  },
  {
    title: 'Form 3CD Statutory Tax Audit',
    category: 'STATUTORY AUDIT',
    priority: 'URGENT',
    description: 'Comprehensive Income Tax Audit report under Section 44AB of the Income Tax Act, 1961.',
    subtasks: [
      'Verify books of accounts & ledger balances',
      'Check compliance with Tax Audit clauses (Clause 1 to 44)',
      'Prepare draft Tax Audit Report (Form 3CA/3CB and Form 3CD)',
      'Obtain Client Management Representation Letter',
      'Upload Tax Audit Report on Income Tax E-Filing Portal',
    ],
  },
  {
    title: 'TDS Quarterly Return Form 26Q Filing',
    category: 'TDS COMPLIANCE',
    priority: 'MEDIUM',
    description: 'Quarterly return filing of tax deduction at source for payments other than salaries.',
    subtasks: [
      'Extract quarterly TDS deduction statement from Tally/Zoho',
      'Verify TDS challan payments on TRACES portal',
      'Generate Form 26Q FVU file using NSDL Utility',
      'Upload FVU file or submit at TIN-FC Center',
    ],
  },
  {
    title: 'ROC Annual Return Form MGT-7 / MGT-7A',
    category: 'ROC / SECRETARIAL',
    priority: 'MEDIUM',
    description: 'Annual Return filing of company details, shareholders, and directors with Ministry of Corporate Affairs.',
    subtasks: [
      'Draft Annual General Meeting (AGM) Notice and Minutes',
      'Prepare Form MGT-7/7A e-form with Director details',
      'Attach Auditor Report, Balance Sheet, & Shareholder List',
      'File e-form on MCA V3 Portal with Director & CA DSC',
    ],
  },
];

export const TaskTemplatesModal = ({ isOpen, onClose, onSelectTemplate }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="1-Click Audit & Tax Task Templates">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <p className="text-xs text-slate-400">
          Select a pre-configured CA audit template to automatically populate task title, category, priority, and subtask checklists.
        </p>

        <div className="grid grid-cols-1 gap-3">
          {PRESET_TEMPLATES.map((tmpl, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {tmpl.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {tmpl.priority}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectTemplate(tmpl);
                    onClose();
                  }}
                  className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5"
                >
                  <FiZap />
                  <span>Use Template</span>
                </button>
              </div>

              <h4 className="text-sm font-bold text-slate-100">{tmpl.title}</h4>
              <p className="text-xs text-slate-400">{tmpl.description}</p>

              {/* Subtasks Preview */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Preset Subtasks ({tmpl.subtasks.length}):</span>
                {tmpl.subtasks.map((st, i) => (
                  <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <FiCheck className="text-indigo-400 flex-shrink-0" />
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
