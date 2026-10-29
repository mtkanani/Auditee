import React from 'react';
import { CloudUpload, Lock, LockOpen } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { Button, Field, Input, Select, Textarea } from '../../ui';
import { cn } from '../../../lib/cn';
import { useUploadForm } from './useUploadForm';
import { DropZone } from './DropZone';

const CATEGORIES = [
  { value: 'GST_FILINGS', label: 'GST filings' },
  { value: 'INCOME_TAX', label: 'Income tax' },
  { value: 'AUDIT_REPORTS', label: 'Audit reports' },
  { value: 'ROC_MCA', label: 'ROC / MCA' },
  { value: 'FINANCIAL_STATEMENTS', label: 'Financial statements' },
  { value: 'KYC_LEGAL', label: 'KYC and legal' },
  { value: 'GENERAL', label: 'General' },
];

/** canMarkConfidential: false for client-portal users (the API files their uploads as non-confidential). */
export const UploadDocumentModal = ({ isOpen, onClose, onSuccess, clients = [], canMarkConfidential = true }) => {
  const { form, setForm, setField, file, progress, handleFileChange, handleSubmit, handleClose, uploadMutation } = useUploadForm({ onClose, onSuccess });

  if (!isOpen) return null;

  const confidential = form.isConfidential;
  const uploading = uploadMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload a document" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <DropZone fileName={file?.name} fileSize={file?.size} onFile={handleFileChange} disabled={uploading} />

        <Field label="Title" required>
          {(p) => <Input {...p} required placeholder="e.g. GST return Q3 FY 2025-26" value={form.title} onChange={setField('title')} />}
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Category">
            {(p) => <Select {...p} value={form.category} onChange={setField('category')} options={CATEGORIES} />}
          </Field>
          {clients.length > 0 && (
          <Field label="Client" hint="Optional">
            {(p) => (
              <Select {...p} value={form.clientId} onChange={setField('clientId')}>
                <option value="">No client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.clientName || c.companyName}</option>
                ))}
              </Select>
            )}
          </Field>
          )}
        </div>

        <Field label="Notes" hint="Optional">
          {(p) => <Textarea {...p} rows={2} placeholder="Anything others should know about this file" value={form.notes} onChange={setField('notes')} />}
        </Field>

        {canMarkConfidential && (
        <button
          type="button"
          role="switch"
          aria-checked={confidential}
          onClick={() => setForm((p) => ({ ...p, isConfidential: !p.isConfidential }))}
          className={cn(
            'w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
            confidential ? 'border-warning/40 bg-warning-soft' : 'border-line hover:border-line-strong'
          )}
        >
          <span className={cn('grid place-items-center w-9 h-9 rounded-xl shrink-0', confidential ? 'bg-warning/15 text-warning' : 'bg-hover text-muted')}>
            {confidential ? <Lock className="w-4 h-4" aria-hidden="true" /> : <LockOpen className="w-4 h-4" aria-hidden="true" />}
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-medium text-fg">Confidential</span>
            <span className="block text-xs text-muted">
              {confidential ? 'Only firm admins and you can see it' : 'Everyone at the firm, and the linked client, can see it'}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={cn('relative w-9 h-5 rounded-full transition-colors shrink-0', confidential ? 'bg-warning' : 'bg-line-strong')}
          >
            <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all', confidential ? 'left-[18px]' : 'left-0.5')} />
          </span>
        </button>
        )}

        {uploading && (
          <div className="space-y-1.5" role="status" aria-live="polite">
            <div className="flex justify-between text-xs text-muted">
              <span>{progress < 100 ? 'Uploading…' : 'Saving…'}</span>
              <span className="tabular-nums">{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-hover overflow-hidden">
              <div className="h-full bg-accent transition-[width] duration-200" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={handleClose} disabled={uploading}>Cancel</Button>
          <Button type="submit" variant="primary" icon={CloudUpload} loading={uploading}>Upload</Button>
        </div>
      </form>
    </Modal>
  );
};
