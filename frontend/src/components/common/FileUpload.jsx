import React, { useState } from 'react';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';

export const FileUpload = ({ onFileSelect, acceptedTypes = '*', maxMb = 10 }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.size > maxMb * 1024 * 1024) {
      setError(`File size exceeds ${maxMb}MB limit.`);
      return;
    }
    setError('');
    setFile(selectedFile);
    if (onFileSelect) onFileSelect(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div className="w-full">
      {!file ? (
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl bg-slate-900/40 hover:bg-slate-900/80 cursor-pointer transition-all duration-200 group"
        >
          <FiUploadCloud className="w-10 h-10 text-indigo-400 group-hover:scale-110 transition-transform duration-200 mb-2" />
          <p className="text-sm font-semibold text-slate-200">
            Click to upload <span className="font-normal text-slate-400">or drag and drop</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">PDF, DOCX, PNG, JPG up to {maxMb}MB</p>
          <input
            type="file"
            accept={acceptedTypes}
            className="hidden"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <FiFile className="w-6 h-6" />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      )}
      {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
    </div>
  );
};
