import React, { useState, useMemo, useEffect } from 'react';
import { Archive, CloudUpload, Download, File, FileText, Folder, Funnel, Grid3x3, Image, List, Lock, RefreshCw, Search, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useVaultDocuments, useDeleteDocument } from '../../queries/useDocuments';
import { useFirmClients } from '../../queries/useLookups';
import { useDebounce } from '../../hooks/useDebounce';
import { Modal } from '../../components/common/Modal';
import { TableSkeleton, CardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { UploadDocumentModal } from '../../components/documents/UploadDocumentModal';

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
  'application/pdf': { icon: FileText, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: File, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  'application/vnd.ms-excel': { icon: File, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  'image/jpeg': { icon: Image, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  'image/png': { icon: Image, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  'application/zip': { icon: Archive, color: 'text-purple-400', bg: 'bg-purple-500/10' },
};

const getFileStyle = (mimeType) =>
  FILE_ICONS[mimeType] || { icon: File, color: 'text-slate-400', bg: 'bg-slate-500/10' };

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

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const [page, setPage] = useState(1);

  const filters = useMemo(() => {
    const params = { page, limit: 12 };
    if (category !== 'ALL') params.category = category;
    if (debouncedSearch) params.search = debouncedSearch;
    return params;
  }, [page, category, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [category, debouncedSearch]);

  const scope = isFirmAdmin ? 'firm' : isClient ? 'client' : 'user';
  const { docs, pagination, summary, isLoading, isFetching, refetch } = useVaultDocuments(scope, filters);
  const { data: clients = [] } = useFirmClients({ limit: 200 }, { enabled: isFirmAdmin });
  const deleteMutation = useDeleteDocument();

  const handleDelete = (id) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setDeleteConfirm(null);
      },
    });
  };

  // Stats cover every matching document (computed server-side), not just this page
  const stats = {
    total: summary?.total || 0,
    gst: summary?.gst || 0,
    tax: summary?.tax || 0,
    confidential: summary?.confidential || 0,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/25">
              <Folder className="w-5 h-5 text-white"  />
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
            onClick={() => refetch()}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`}  />
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 transition-all"
          >
            <CloudUpload className="w-4 h-4"  />
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
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4"  />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by title, file name, or client..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Funnel className="text-slate-500 w-4 h-4 flex-shrink-0"  />
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
              <Grid3x3 className="w-4 h-4"  />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-100'}`}
            >
              <List className="w-4 h-4"  />
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
      {isLoading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <TableSkeleton rows={6} cols={5} />
        )
      ) : docs.length === 0 ? (
        <EmptyState
          title="Document Vault is empty"
          description="Upload your first document to get started"
          action={
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="py-2 px-5 rounded-xl bg-indigo-600 text-white font-bold text-sm cursor-pointer"
            >
              <CloudUpload className="inline w-4 h-4 mr-1.5" />Upload Document
            </button>
          }
        />
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
                        <Lock className="w-3 h-3"  />
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
                    <Download className="w-3 h-3"  /> Download
                  </a>
                  {(isFirmAdmin || doc.uploadedBy === user?.id) && (
                    <button
                      onClick={() => setDeleteConfirm(doc.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5"  />
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
                    <Download className="w-3.5 h-3.5"  />
                  </a>
                  {(isFirmAdmin || doc.uploadedBy === user?.id) && (
                    <button
                      onClick={() => setDeleteConfirm(doc.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5"  />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pagination?.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          totalRecords={pagination.totalRecords}
          limit={12}
          onPageChange={setPage}
        />
      )}

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-100">Delete Document?</span>
              <span className="block text-[11px] font-normal text-slate-400">This action cannot be undone</span>
            </div>
          </div>
        }
        maxWidth="max-w-sm"
      >
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(deleteConfirm)}
            disabled={deleteMutation.isPending}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-colors disabled:opacity-50"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>

      {/* Upload Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        clients={clients}
      />
    </div>
  );
};
