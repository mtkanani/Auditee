import React, { useState, useEffect, useCallback } from 'react';
import {
  FiFolder,
  FiUploadCloud,
  FiSearch,
  FiDownload,
  FiTrash2,
  FiGrid,
  FiList,
  FiLock,
  FiFile,
  FiFileText,
  FiImage,
  FiArchive,
  FiRefreshCw,
  FiFilter,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { documentService } from '../../services/documentService';
import { UploadDocumentModal } from '../../components/documents/UploadDocumentModal';
import { clientService } from '../../services/clientService';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'ALL', label: 'All Documents', icon: '📁' },
  { value: 'GST_FILINGS', label: 'GST Filings', icon: '🧾' },
  { value: 'INCOME_TAX', label: 'Income Tax', icon: '💰' },
  { value: 'AUDIT_REPORTS', label: 'Audit Reports', icon: '📋' },
  { value: 'ROC_MCA', label: 'ROC / MCA', icon: '🏛️' },
  { value: 'FINANCIAL_STATEMENTS', label: 'Financial Statements', icon: '📊' },
  { value: 'KYC_LEGAL', label: 'KYC & Legal', icon: '🔏' },
  { value: 'GENERAL', label: 'General', icon: '🗂️' },
];

const FILE_ICONS = {
  'application/pdf': { icon: FiFileText, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: FiFile, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  'application/vnd.ms-excel': { icon: FiFile, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FiFileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  'image/jpeg': { icon: FiImage, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  'image/png': { icon: FiImage, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  'application/zip': { icon: FiArchive, color: 'text-purple-400', bg: 'bg-purple-500/10' },
};

const getFileStyle = (mimeType) =>
  FILE_ICONS[mimeType] || { icon: FiFile, color: 'text-slate-400', bg: 'bg-slate-500/10' };

const formatFileSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const categoryLabel = (cat) => CATEGORIES.find((c) => c.value === cat) || { label: cat, icon: '📁' };

export const DocumentVault = () => {
  const { user } = useAuth();
  const isFirmAdmin = user?.role === 'FIRM_ADMIN' || user?.role === 'ADMIN';
  const isClient = user?.role === 'CLIENT';

  const [docs, setDocs] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'ALL') params.category = category;
      if (search) params.search = search;

      let res;
      if (isFirmAdmin) res = await documentService.getFirmVault(params);
      else if (isClient) res = await documentService.getClientVault(params);
      else res = await documentService.getUserVault(params);

      setDocs(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
      toast.error('Failed to load document vault');
    } finally {
      setLoading(false);
    }
  }, [category, search, isFirmAdmin, isClient]);

  const fetchClients = useCallback(async () => {
    if (!isFirmAdmin) return;
    try {
      const res = await clientService.getClients({ limit: 200 });
      setClients(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  }, [isFirmAdmin]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleDelete = async (id) => {
    try {
      await documentService.deleteDocument(id);
      toast.success('Document removed from vault');
      setDeleteConfirm(null);
      fetchDocuments();
    } catch (err) {
      toast.error('Failed to delete document');
    }
  };

  // Stats
  const stats = {
    total: docs.length,
    gst: docs.filter((d) => d.category === 'GST_FILINGS').length,
    tax: docs.filter((d) => d.category === 'INCOME_TAX').length,
    confidential: docs.filter((d) => d.isConfidential).length,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/25">
              <FiFolder className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-100">Document Vault</h1>
              <p className="text-xs text-slate-400">
                {isFirmAdmin ? 'Firm-wide secure document storage' : isClient ? 'Your shared documents' : 'Your workspace documents'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDocuments}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            title="Refresh"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 transition-all"
          >
            <FiUploadCloud className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Documents', value: stats.total, color: 'from-indigo-500 to-purple-500', icon: '📁' },
          { label: 'GST Filings', value: stats.gst, color: 'from-emerald-500 to-teal-500', icon: '🧾' },
          { label: 'Income Tax', value: stats.tax, color: 'from-amber-500 to-orange-500', icon: '💰' },
          { label: 'Confidential', value: stats.confidential, color: 'from-rose-500 to-pink-500', icon: '🔒' },
        ].map((s) => (
          <div
            key={s.label}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-2xl font-extrabold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                {s.value}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by title, file name, or client..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter className="text-slate-500 w-4 h-4 flex-shrink-0" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="py-2.5 px-3 text-sm rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
            ))}
          </select>
          {/* View Mode Toggles */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-100'}`}
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-100'}`}
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all ${
              category === c.value
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Documents Grid / List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-semibold">Loading vault...</p>
          </div>
        </div>
      ) : docs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center">
            <FiFolder className="w-10 h-10 text-slate-600" />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-slate-300">Document Vault is empty</p>
            <p className="text-sm text-slate-500 mt-1">Upload your first document to get started</p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="py-2 px-5 rounded-xl bg-indigo-600 text-white font-bold text-sm"
          >
            <FiUploadCloud className="inline w-4 h-4 mr-1.5" />Upload Document
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {docs.map((doc) => {
            const { icon: FileIcon, color, bg } = getFileStyle(doc.mimeType);
            const cat = categoryLabel(doc.category);
            return (
              <div
                key={doc.id}
                className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 hover:shadow-lg hover:shadow-slate-900/60 transition-all duration-200"
              >
                {/* File icon & badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                    <FileIcon className={`w-6 h-6 ${color}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {doc.isConfidential && (
                      <span title="Confidential" className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
                        <FiLock className="w-3 h-3" />
                      </span>
                    )}
                    <span className="text-[10px] font-bold py-0.5 px-2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {cat.icon} {cat.label}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <p className="text-sm font-bold text-slate-100 line-clamp-2 mb-1">{doc.title}</p>
                <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">{doc.fileName}</p>

                {/* Meta */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-3">
                  <span>{formatFileSize(doc.fileSize)}</span>
                  <span>{formatDate(doc.createdAt)}</span>
                </div>

                {/* Client */}
                {doc.client && (
                  <div className="py-1 px-2 rounded-lg bg-slate-800 text-[10px] font-semibold text-slate-400 mb-3 truncate">
                    👤 {doc.client.clientName || doc.client.companyName}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 rounded-lg bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 hover:bg-indigo-600/20 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <FiDownload className="w-3 h-3" /> Download
                  </a>
                  {(isFirmAdmin || doc.uploadedBy === user?.id) && (
                    <button
                      onClick={() => setDeleteConfirm(doc.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete document"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-1">Type</div>
            <div className="col-span-4">Document</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Client</div>
            <div className="col-span-1">Size</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-1">Actions</div>
          </div>
          {docs.map((doc) => {
            const { icon: FileIcon, color, bg } = getFileStyle(doc.mimeType);
            const cat = categoryLabel(doc.category);
            return (
              <div
                key={doc.id}
                className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors items-center"
              >
                <div className="col-span-1">
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                    <FileIcon className={`w-4 h-4 ${color}`} />
                  </div>
                </div>
                <div className="col-span-4">
                  <p className="text-sm font-semibold text-slate-200 line-clamp-1">{doc.title}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{doc.fileName}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-bold py-0.5 px-2 rounded-full bg-indigo-500/10 text-indigo-400">
                    {cat.icon} {cat.label}
                  </span>
                </div>
                <div className="col-span-2 text-xs text-slate-400 truncate">
                  {doc.client ? (doc.client.clientName || doc.client.companyName) : '—'}
                </div>
                <div className="col-span-1 text-xs text-slate-500">{formatFileSize(doc.fileSize)}</div>
                <div className="col-span-1 text-xs text-slate-500">{formatDate(doc.createdAt)}</div>
                <div className="col-span-1 flex items-center gap-1">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 hover:bg-indigo-600/20 transition-colors"
                    title="Download"
                  >
                    <FiDownload className="w-3.5 h-3.5" />
                  </a>
                  {(isFirmAdmin || doc.uploadedBy === user?.id) && (
                    <button
                      onClick={() => setDeleteConfirm(doc.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <FiTrash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Delete Document?</h3>
                <p className="text-[11px] text-slate-400">This action cannot be undone</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={fetchDocuments}
        clients={clients}
      />
    </div>
  );
};
