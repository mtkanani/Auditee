import React from 'react';
import { ExternalLink, FileText, Paperclip, Plus } from 'lucide-react';
import { Button, Field, Input } from '../../ui';

export const AttachmentsTab = ({ handleAddDocument, docName, setDocName, docUrl, setDocUrl, task }) => {
  const documents = task?.documents || [];
  return (
    <div className="space-y-5">
      <form onSubmit={handleAddDocument} className="rounded-2xl border border-line bg-surface p-5 space-y-4">
        <h4 className="text-sm font-semibold text-fg">Attach a file</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="File name" required>
            {(p) => <Input {...p} required placeholder="GSTR-3B computation.pdf" value={docName} onChange={(e) => setDocName(e.target.value)} />}
          </Field>
          <Field label="Link" required>
            {(p) => <Input {...p} required placeholder="https://drive.google.com/…" value={docUrl} onChange={(e) => setDocUrl(e.target.value)} />}
          </Field>
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="primary" icon={Plus}>Add file</Button>
        </div>
      </form>

      {documents.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-accent-soft text-accent-fg shrink-0">
                <FileText className="w-4 h-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-fg truncate">{doc.fileName}</p>
                <p className="text-xs text-subtle capitalize">Added by {(doc.uploadedRole || 'user').toLowerCase()}</p>
              </div>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${doc.fileName}`}
                className="grid place-items-center w-8 h-8 rounded-lg text-accent-fg hover:bg-accent-soft transition-colors"
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center py-10 text-center rounded-2xl border border-dashed border-line">
          <Paperclip className="w-5 h-5 text-subtle mb-2" aria-hidden="true" />
          <p className="text-sm text-muted">No files attached to this task yet.</p>
        </div>
      )}
    </div>
  );
};
