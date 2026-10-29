import React from 'react';
import { ExternalLink, FileText, Plus, Trash2 } from 'lucide-react';
import { Button, Field, Input, Select } from '../../ui';

const TYPES = [
  { value: 'GST_CERTIFICATE', label: 'GST certificate' },
  { value: 'PAN_CARD', label: 'PAN card' },
  { value: 'INCORPORATION_DEED', label: 'Incorporation deed or MOA' },
  { value: 'BANK_STATEMENT', label: 'Bank statement' },
  { value: 'AUDIT_REPORT', label: 'Past audit report' },
  { value: 'OTHER', label: 'Other' },
];
const typeLabel = (v) => TYPES.find((t) => t.value === v)?.label || v;

export const DocumentsTab = ({
  client,
  isAddingDoc,
  setIsAddingDoc,
  docForm,
  setDocForm,
  handleAddDocument,
  handleDeleteDocument,
}) => {
  const set = (key) => (e) => setDocForm({ ...docForm, [key]: e.target.value });
  const docs = client.documents || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">Registration certificates, deeds and statements for this client.</p>
        {!isAddingDoc && (
          <Button size="sm" variant="soft" icon={Plus} onClick={() => setIsAddingDoc(true)}>Add document</Button>
        )}
      </div>

      {isAddingDoc && (
        <form onSubmit={handleAddDocument} className="rounded-2xl border border-accent/30 bg-accent-soft/40 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Document name" required>
              {(p) => <Input {...p} required placeholder="GST registration certificate" value={docForm.documentName} onChange={set('documentName')} />}
            </Field>
            <Field label="Type">
              {(p) => <Select {...p} value={docForm.documentType} onChange={set('documentType')} options={TYPES} />}
            </Field>
            <Field label="Link to file" required>
              {(p) => <Input {...p} required placeholder="https://drive.google.com/…" value={docForm.fileUrl} onChange={set('fileUrl')} />}
            </Field>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsAddingDoc(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save document</Button>
          </div>
        </form>
      )}

      {docs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line px-5 py-10 text-center">
          <FileText className="w-6 h-6 text-subtle mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm font-medium text-fg">No documents yet</p>
          <p className="text-sm text-muted">Keep a client's key certificates here so the team can find them.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {docs.map((doc) => (
            <li key={doc.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-warning-soft text-warning shrink-0">
                <FileText className="w-5 h-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-fg truncate">{doc.documentName}</p>
                <p className="text-xs text-subtle truncate">
                  {typeLabel(doc.documentType)} · {new Date(doc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${doc.documentName}`}
                className="grid place-items-center w-8 h-8 rounded-lg text-muted hover:text-fg hover:bg-hover"
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label={`Delete ${doc.documentName}`}
                className="hover:text-danger hover:bg-danger-soft"
                onClick={() => handleDeleteDocument(doc.id)}
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
