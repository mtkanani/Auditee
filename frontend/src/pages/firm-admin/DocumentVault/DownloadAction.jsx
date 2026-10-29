import React from 'react';
import { Download, FileX, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { fileState } from './files';

const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50';
const styles = {
  card: 'flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-lg bg-accent-soft text-accent-fg text-xs font-medium hover:brightness-110 transition',
  icon: 'grid place-items-center h-8 w-8 rounded-lg text-accent-fg hover:bg-accent-soft transition-colors',
};

/**
 * Download control for one document. Stored files get a fresh signed link from the API,
 * outside links open as before, and rows that never had a file say so instead.
 * variant: 'card' (labelled button) | 'icon' (table row).
 */
export const DownloadAction = ({ doc, download, downloadingId, variant = 'card' }) => {
  const state = fileState(doc);
  const label = `Download ${doc.title}`;

  if (state === 'missing') {
    return (
      <span
        title="This file was never uploaded. Upload it again."
        className={cn(
          variant === 'card'
            ? 'flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-lg bg-hover text-subtle text-xs font-medium'
            : 'grid place-items-center h-8 w-8 rounded-lg text-subtle'
        )}
      >
        <FileX className={variant === 'card' ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />
        {variant === 'card' ? 'File missing' : <span className="sr-only">File missing for {doc.title}</span>}
      </span>
    );
  }

  const content = (busy) => {
    const Icon = busy ? Loader2 : Download;
    return (
      <>
        <Icon className={cn(variant === 'card' ? 'w-3.5 h-3.5' : 'w-4 h-4', busy && 'animate-spin')} aria-hidden="true" />
        {variant === 'card' && 'Download'}
      </>
    );
  };

  if (state === 'link') {
    return (
      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" aria-label={label} title="Download" className={cn(styles[variant], focus)}>
        {content(false)}
      </a>
    );
  }

  const busy = downloadingId === doc.id;
  return (
    <button type="button" onClick={() => download(doc)} disabled={busy} aria-label={label} title="Download" className={cn(styles[variant], focus, 'disabled:opacity-70')}>
      {content(busy)}
    </button>
  );
};
