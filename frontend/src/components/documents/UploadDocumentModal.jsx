import React, { useState, useRef } from 'react';
import {
  FiX,
  FiUploadCloud,
  FiFile,
  FiLock,
  FiUnlock,
  FiTag,
  FiLoader,
} from 'react-icons/fi';
import { documentService } from '../../services/documentService';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'GST_FILINGS', label: '🧾 GST Filings' },
  { value: 'INCOME_TAX', label: '💰 Income Tax' },
  { value: 'AUDIT_REPORTS', label: '📋 Audit Reports' },
  { value: 'ROC_MCA', label: '🏛️ ROC / MCA' },
  { value: 'FINANCIAL_STATEMENTS', label: '📊 Financial Statements' },
  { value: 'KYC_LEGAL', label: '🔏 KYC & Legal' },
  { value: 'GENERAL', label: '📁 General' },
];

export const UploadDocumentModal = ({ isOpen, onClose, onSuccess, clients = [] }) => {
  const [form, setForm] = useState({
    title: '',
    fileName: '',
    fileUrl: '',
    fileSize: 0,
    mimeType: 'application/pdf',
    category: 'GENERAL',
    clientId: '',
    taskId: '',
    isConfidential: false,
    notes: '',
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (file) => {
    if (!file) return;
    // In a real system this would upload to S3/Cloudinary. We'll simulate with a fake URL.
    const fakeUrl = `https://auditee-vault.s3.amazonaws.com/${Date.now()}_${file.name}`;
    setForm((prev) => ({
      ...prev,
      fileName: file.name,
      fileUrl: fakeUrl,
      fileSize: file.size,
      mimeType: file.type || 'application/octet-stream',
      title: prev.title || file.name.replace(/\.[^.]+$/, ''),
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.fileUrl || !form.fileName) {
      toast.error('Please fill in all required fields and select a file.');
      return;
    }
    setIsLoading(true);
    try {
      await documentService.uploadDocument({
        ...form,
        clientId: form.clientId ? parseInt(form.clientId, 10) : null,
        taskId: form.taskId ? parseInt(form.taskId, 10) : null,
      });
      toast.success('📁 Document uploaded to vault successfully!');
      setForm({
        title: '',
        fileName: '',
        fileUrl: '',
        fileSize: 0,
        mimeType: 'application/pdf',
        category: 'GENERAL',
        clientId: '',
        taskId: '',
        isConfidential: false,
        notes: '',
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <FiUploadCloud className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Upload to Document Vault</h2>
              <p className="text-[11px] text-slate-400">Securely store & categorize your documents</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-indigo-500 bg-indigo-500/10'
                : form.fileName
                ? 'border-emerald-500/60 bg-emerald-500/5'
                : 'border-slate-700 hover:border-slate-500 bg-slate-800/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.zip"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
            {form.fileName ? (
              <div className="flex flex-col items-center gap-2">
                <FiFile className="w-10 h-10 text-emerald-400" />
                <p className="text-sm font-bold text-emerald-400">{form.fileName}</p>
                <p className="text-[11px] text-slate-400">{(form.fileSize / 1024).toFixed(1)} KB — Click to change</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <FiUploadCloud className="w-10 h-10 text-slate-500" />
                <p className="text-sm font-semibold text-slate-300">Drag & drop your file here</p>
                <p className="text-[11px] text-slate-500">PDF, DOCX, XLSX, ZIP, PNG (Max 25MB)</p>
                <span className="mt-2 py-1.5 px-4 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-xs font-bold text-indigo-400">
                  Browse File
                </span>
              </div>
            )}
          </div>

          {/* Document Title */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Document Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. GST Return Q3 FY2025-26"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                <FiTag className="inline w-3 h-3 mr-1" />Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800/60 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Client */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Link to Client (Optional)
              </label>
              <select
                value={form.clientId}
                onChange={(e) => setForm((p) => ({ ...p, clientId: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800/60 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="">— None —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.clientName || c.companyName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Add any notes or comments about this document..."
              rows={2}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Confidential Toggle */}
          <div
            onClick={() => setForm((p) => ({ ...p, isConfidential: !p.isConfidential }))}
            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
              form.isConfidential
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600'
            }`}
          >
            {form.isConfidential ? <FiLock className="w-4 h-4" /> : <FiUnlock className="w-4 h-4" />}
            <div>
              <p className="text-xs font-bold">
                {form.isConfidential ? '🔒 Confidential Document' : '🔓 Not Confidential'}
              </p>
              <p className="text-[10px] opacity-70">
                {form.isConfidential
                  ? 'Only Firm Admins can see this document'
                  : 'Clients & users can view this document'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <><FiLoader className="w-4 h-4 animate-spin" /> Uploading...</>
              ) : (
                <><FiUploadCloud className="w-4 h-4" /> Upload to Vault</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
