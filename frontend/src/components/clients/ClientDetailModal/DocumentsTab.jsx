import React, { useState } from 'react';
import { Download, ExternalLink, FileText, Plus, Trash2 } from 'lucide-react';
import { Button, Field, Input, Select } from '../../ui';
import { AttachmentPicker } from '../../documents/AttachmentPicker';
import { useOpenClientDocument, useUploadClientDocument } from '../../../queries/useAttachments';

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
  const [mode, setMode] = useState('file');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const upload = useUploadClientDocument();
  const openDoc = useOpenClientDocument();

  const pickFile = (f) => {
    setFile(f);
    // Suggest the file name when no name has been typed yet.
    if (f && !docForm.documentName.trim()) setDocForm({ ...docForm, documentName: f.name.replace(/\.[^.]+$/, '') });
  };

  const submit = (e) => {
    if (mode === 'link') return handleAddDocument(e);
    e.preventDefault();
    if (!file || !docForm.documentName.trim()) return;
    upload.mutate(
      {
        clientId: client.id,
        file,
        details: { documentName: docForm.documentName, documentType: docForm.documentType },
        onProgress: setProgress,
      },
      {
        onSuccess: () => {
          setFile(null);
          setIsAddingDoc(false);
          setDocForm({ documentName: '', documentType: 'GST_CERTIFICATE', fileUrl: '' });
        },
        onSettled: () => setProgress(0),
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">Registration certificates, deeds and statements for this client.</p>
        {!isAddingDoc && (
          <Button size="sm" variant="soft" icon={Plus} onClick={() => setIsAddingDoc(true)}>Add document</Button>
        )}
      </div>

      {isAddingDoc && (
        <form onSubmit={submit} className="rounded-2xl border border-accent/30 bg-accent-soft/40 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Document name" required>
              {(p) => <Input {...p} required placeholder="GST registration certificate" value={docForm.documentName} onChange={set('documentName')} />}
            </Field>
            <Field label="Type">
              {(p) => <Select {...p} value={docForm.documentType} onChange={set('documentType')} options={TYPES} />}
            </Field>
          </div>
          <AttachmentPicker
            mode={mode}
            onModeChange={setMode}
            file={file}
            onFile={pickFile}
            url={docForm.fileUrl}
            onUrl={(v) => setDocForm({ ...docForm, fileUrl: v })}
            progress={progress}
            disabled={upload.isPending}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsAddingDoc(false)} disabled={upload.isPending}>Cancel</Button>
            <Button type="submit" variant="primary" loading={upload.isPending} disabled={mode === 'file' && !file}>
              {mode === 'file' ? 'Upload document' : 'Save document'}
            </Button>
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
              <Button
                size="icon-sm"
                variant="ghost"
                icon={doc.storageKey ? Download : ExternalLink}
                aria-label={`${doc.storageKey ? 'Download' : 'Open'} ${doc.documentName}`}
                disabled={!doc.storageKey && !doc.fileUrl}
                onClick={() => openDoc.mutate({ clientId: client.id, doc })}
              />
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
