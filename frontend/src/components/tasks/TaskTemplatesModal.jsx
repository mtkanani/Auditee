import React from 'react';
import { Check, Zap } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Badge, Button } from '../ui';
import { PriorityBadge } from './PriorityBadge';

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

const CATEGORY_LABELS = {
  'TAXATION (GST)': 'GST',
  'STATUTORY AUDIT': 'Statutory audit',
  'TDS COMPLIANCE': 'TDS',
  'ROC / SECRETARIAL': 'ROC / secretarial',
};

export const TaskTemplatesModal = ({ isOpen, onClose, onSelectTemplate }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Start from a template" maxWidth="max-w-2xl">
      <div className="space-y-4">
        <p className="text-sm text-muted">
          Pick a ready-made CA task. It fills in the title, priority, scope and checklist, and you can change anything before saving.
        </p>

        <ul className="space-y-3">
          {PRESET_TEMPLATES.map((tmpl) => (
            <li key={tmpl.title} className="rounded-2xl border border-line bg-surface p-5 space-y-3 transition-colors hover:border-line-strong">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="accent">{CATEGORY_LABELS[tmpl.category] || tmpl.category}</Badge>
                    <PriorityBadge priority={tmpl.priority} />
                  </div>
                  <h4 className="text-sm font-semibold text-fg">{tmpl.title}</h4>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  icon={Zap}
                  onClick={() => {
                    onSelectTemplate(tmpl);
                    onClose();
                  }}
                >
                  Use template
                </Button>
              </div>

              <p className="text-sm text-muted">{tmpl.description}</p>

              <div className="pt-3 border-t border-line">
                <p className="text-xs text-subtle mb-1.5">Checklist ({tmpl.subtasks.length} items)</p>
                <ul className="space-y-1">
                  {tmpl.subtasks.map((st) => (
                    <li key={st} className="flex items-start gap-2 text-sm text-muted">
                      <Check className="w-3.5 h-3.5 mt-1 text-success shrink-0" aria-hidden="true" />
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};
