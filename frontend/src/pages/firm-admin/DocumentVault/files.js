import { Archive, File, FileSpreadsheet, FileText, Image } from 'lucide-react';

export const CATEGORIES = [
  { value: 'ALL', label: 'All documents' },
  { value: 'GST_FILINGS', label: 'GST filings' },
  { value: 'INCOME_TAX', label: 'Income tax' },
  { value: 'AUDIT_REPORTS', label: 'Audit reports' },
  { value: 'ROC_MCA', label: 'ROC / MCA' },
  { value: 'FINANCIAL_STATEMENTS', label: 'Financial statements' },
  { value: 'KYC_LEGAL', label: 'KYC and legal' },
  { value: 'GENERAL', label: 'General' },
];

export const categoryLabel = (cat) => CATEGORIES.find((c) => c.value === cat)?.label || cat;

// File-type icon and tint, by MIME type.
const PDF = { icon: FileText, tint: 'bg-danger-soft text-danger' };
const SHEET = { icon: FileSpreadsheet, tint: 'bg-success-soft text-success' };
const DOC = { icon: FileText, tint: 'bg-accent-soft text-accent-fg' };
const IMAGE = { icon: Image, tint: 'bg-warning-soft text-warning' };
const FILE_TYPES = {
  'application/pdf': PDF,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': SHEET,
  'application/vnd.ms-excel': SHEET,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': DOC,
  'image/jpeg': IMAGE,
  'image/png': IMAGE,
  'application/zip': { icon: Archive, tint: 'bg-hover text-muted' },
};

export const fileType = (mimeType) => FILE_TYPES[mimeType] || { icon: File, tint: 'bg-hover text-muted' };

export const formatFileSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export const clientName = (doc) => doc.client?.clientName || doc.client?.companyName;

// Rows saved before real uploads existed point at a made-up bucket; there is no file behind them.
const PLACEHOLDER_URL_PREFIX = 'https://auditee-vault.s3.amazonaws.com/';

/** 'stored' (in R2, download via the API), 'link' (an outside link) or 'missing' (never uploaded). */
export const fileState = (doc) => {
  if (doc.storageKey) return 'stored';
  if (doc.fileUrl && !doc.fileUrl.startsWith(PLACEHOLDER_URL_PREFIX)) return 'link';
  return 'missing';
};
