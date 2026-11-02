import React from 'react';
import { Link2, Upload } from 'lucide-react';
import { Field, Input, Tabs } from '../ui';
import { DropZone } from './UploadDocumentModal/DropZone';

const MODES = [
  { value: 'file', label: 'Upload file', icon: Upload },
  { value: 'link', label: 'Paste link', icon: Link2 },
];

/**
 * Either a file to upload or a link to an existing file. Controlled:
 * mode 'file' | 'link', file, url and their setters. progress (0–100) shows while uploading.
 */
export const AttachmentPicker = ({ mode, onModeChange, file, onFile, url, onUrl, progress, disabled }) => (
  <div className="space-y-3">
    <Tabs items={MODES} value={mode} onChange={onModeChange} aria-label="How to add the file" />
    {mode === 'file' ? (
      <>
        <DropZone fileName={file?.name} fileSize={file?.size} onFile={onFile} disabled={disabled} />
        {progress > 0 && (
          <div className="space-y-1" role="status" aria-live="polite">
            <div className="h-1.5 rounded-full bg-hover overflow-hidden">
              <div className="h-full bg-accent transition-[width] duration-200" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted tabular-nums">Uploading… {progress}%</p>
          </div>
        )}
      </>
    ) : (
      <Field label="Link to the file" hint="Google Drive, OneDrive, Dropbox or any share link.">
        {(p) => <Input {...p} type="url" placeholder="https://" value={url} onChange={(e) => onUrl(e.target.value)} disabled={disabled} />}
      </Field>
    )}
  </div>
);
