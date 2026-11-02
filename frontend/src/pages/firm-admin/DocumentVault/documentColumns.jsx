import React from 'react';
import { Lock, Trash2 } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { Badge, Button } from '../../../components/ui';
import { categoryLabel, clientName, fileType, formatDate, formatFileSize } from './files';
import { DownloadAction } from './DownloadAction';

export const getDocumentColumns = ({ canDelete, handleDelete, download, downloadingId }) => [
  {
    key: 'title',
    header: 'Document',
    render: (doc) => {
      const { icon: FileIcon, tint } = fileType(doc.mimeType);
      return (
        <div className="flex items-center gap-3 min-w-0">
          <span className={cn('grid place-items-center w-9 h-9 rounded-xl shrink-0', tint)}>
            <FileIcon className="w-4 h-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 font-medium text-fg truncate max-w-[280px]">
              {doc.title}
              {doc.isConfidential && <Lock className="w-3.5 h-3.5 text-warning shrink-0" aria-label="Confidential" />}
            </p>
            <p className="text-xs text-subtle truncate max-w-[280px]">{doc.fileName}</p>
          </div>
        </div>
      );
    },
  },
  { key: 'category', header: 'Category', render: (doc) => <Badge tone="accent">{categoryLabel(doc.category)}</Badge> },
  { key: 'client', header: 'Client', render: (doc) => <span className="text-muted truncate max-w-[180px] block">{clientName(doc) || '—'}</span> },
  { key: 'fileSize', header: 'Size', align: 'right', render: (doc) => <span className="text-muted tabular-nums">{formatFileSize(doc.fileSize)}</span> },
  { key: 'createdAt', header: 'Added', render: (doc) => <span className="text-muted tabular-nums whitespace-nowrap">{formatDate(doc.createdAt)}</span> },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (doc) => (
      <div className="flex justify-end gap-1">
        <DownloadAction doc={doc} download={download} downloadingId={downloadingId} variant="icon" />
        {canDelete(doc) && (
          <Button size="icon-sm" variant="ghost" aria-label={`Delete ${doc.title}`} title="Delete" onClick={() => handleDelete(doc)} className="text-danger hover:bg-danger-soft">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    ),
  },
];
