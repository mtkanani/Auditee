import React from 'react';
import { Download, Lock, Trash2, User } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { Badge, Button } from '../../../components/ui';
import { categoryLabel, clientName, fileType, formatDate, formatFileSize } from './files';

const DocumentCard = ({ doc, canDelete, handleDelete }) => {
  const { icon: FileIcon, tint } = fileType(doc.mimeType);
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-surface shadow-card p-4 transition-all duration-150 hover:border-line-strong hover:shadow-raised">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={cn('grid place-items-center w-11 h-11 rounded-xl shrink-0', tint)}>
          <FileIcon className="w-5 h-5" aria-hidden="true" />
        </span>
        <div className="flex items-center gap-1.5 min-w-0">
          {doc.isConfidential && (
            <span title="Confidential" className="grid place-items-center w-6 h-6 rounded-full bg-warning-soft text-warning shrink-0">
              <Lock className="w-3 h-3" aria-hidden="true" />
              <span className="sr-only">Confidential</span>
            </span>
          )}
          <Badge tone="accent" className="truncate">{categoryLabel(doc.category)}</Badge>
        </div>
      </div>

      <p className="text-sm font-medium text-fg line-clamp-2">{doc.title}</p>
      <p className="text-xs text-subtle truncate mt-0.5">{doc.fileName}</p>

      <div className="flex items-center justify-between text-xs text-subtle mt-3 tabular-nums">
        <span>{formatFileSize(doc.fileSize)}</span>
        <span>{formatDate(doc.createdAt)}</span>
      </div>

      {doc.client && (
        <p className="flex items-center gap-1.5 text-xs text-muted mt-2 truncate">
          <User className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{clientName(doc)}</span>
        </p>
      )}

      <div className="flex gap-2 mt-auto pt-4">
        <a
          href={doc.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-lg bg-accent-soft text-accent-fg text-xs font-medium hover:brightness-110 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" /> Download
        </a>
        {canDelete(doc) && (
          <Button size="icon-sm" variant="danger" aria-label={`Delete ${doc.title}`} title="Delete" onClick={() => handleDelete(doc)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </article>
  );
};

export const DocumentGrid = ({ docs, canDelete, handleDelete }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {docs.map((doc) => (
      <DocumentCard key={doc.id} doc={doc} canDelete={canDelete} handleDelete={handleDelete} />
    ))}
  </div>
);
