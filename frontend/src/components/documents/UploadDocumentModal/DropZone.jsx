import React, { useRef, useState } from 'react';
import { CloudUpload, FileCheck } from 'lucide-react';
import { cn } from '../../../lib/cn';

const ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.zip';

/** Click or drop a file. A real button, so it also works from the keyboard. */
export const DropZone = ({ fileName, fileSize, onFile, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={ACCEPT}
        tabIndex={-1}
        onChange={(e) => {
          onFile(e.target.files[0]);
          e.target.value = ''; // so picking the same file again still fires
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!disabled) onFile(e.dataTransfer.files[0]);
        }}
        className={cn(
          'w-full flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-60 disabled:cursor-not-allowed',
          isDragging
            ? 'border-accent bg-accent-soft/60'
            : fileName
              ? 'border-success/50 bg-success-soft/40'
              : 'border-line-strong bg-sunken/40 hover:border-accent/60'
        )}
      >
        {fileName ? (
          <>
            <FileCheck className="w-9 h-9 text-success" aria-hidden="true" />
            <span className="text-sm font-medium text-fg break-all">{fileName}</span>
            <span className="text-xs text-muted">{(fileSize / 1024).toFixed(1)} KB · click to choose another file</span>
          </>
        ) : (
          <>
            <CloudUpload className="w-9 h-9 text-subtle" aria-hidden="true" />
            <span className="text-sm font-medium text-fg">Drop a file here, or click to browse</span>
            <span className="text-xs text-subtle">PDF, DOCX, XLSX, CSV, JPG, PNG or ZIP · up to 25 MB</span>
          </>
        )}
      </button>
    </>
  );
};
