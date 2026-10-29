import React, { useState } from 'react';
import { Download, ExternalLink, FileText, Paperclip, Plus } from 'lucide-react';
import { Button, Field, Input } from '../../ui';
import { AttachmentPicker } from '../../documents/AttachmentPicker';
import { useOpenTaskAttachment, useUploadTaskAttachment } from '../../../queries/useAttachments';

export const AttachmentsTab = ({ handleAddDocument, docName, setDocName, docUrl, setDocUrl, task, taskId }) => {
  const documents = task?.documents || [];
  const [mode, setMode] = useState('file');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const upload = useUploadTaskAttachment();
  const openFile = useOpenTaskAttachment();

  const submit = (e) => {
    if (mode === 'link') return handleAddDocument(e);
    e.preventDefault();
    if (!file) return;
    upload.mutate(
      { taskId, file, onProgress: setProgress },
      {
        onSuccess: () => setFile(null),
        onSettled: () => setProgress(0),
      }
    );
  };

  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="rounded-2xl border border-line bg-surface p-5 space-y-4">
        <h4 className="text-sm font-semibold text-fg">Attach a file</h4>
        <AttachmentPicker
          mode={mode}
          onModeChange={setMode}
          file={file}
          onFile={setFile}
          url={docUrl}
          onUrl={setDocUrl}
          progress={progress}
          disabled={upload.isPending}
        />
        {mode === 'link' && (
          <Field label="File name" required>
            {(p) => <Input {...p} required placeholder="GSTR-3B computation.pdf" value={docName} onChange={(e) => setDocName(e.target.value)} />}
          </Field>
        )}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" icon={Plus} loading={upload.isPending} disabled={mode === 'file' && !file}>
            {mode === 'file' ? 'Upload' : 'Add link'}
          </Button>
        </div>
      </form>

      {documents.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {documents.map((doc) => {
            const Icon = doc.storageKey ? Download : ExternalLink;
            return (
              <li key={doc.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
                <span className="grid place-items-center w-9 h-9 rounded-xl bg-accent-soft text-accent-fg shrink-0">
                  <FileText className="w-4 h-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-fg truncate">{doc.fileName}</p>
                  <p className="text-xs text-subtle capitalize">Added by {(doc.uploadedRole || 'user').toLowerCase()}</p>
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  icon={Icon}
                  aria-label={`${doc.storageKey ? 'Download' : 'Open'} ${doc.fileName}`}
                  disabled={!doc.storageKey && !doc.fileUrl}
                  onClick={() => openFile.mutate({ taskId, doc })}
                />
              </li>
            );
          })}
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
