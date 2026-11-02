import React from 'react';
import { CloudUpload, FolderOpen, RefreshCw } from 'lucide-react';
import { CardSkeleton } from '../../../components/common/Skeleton';
import { EmptyState } from '../../../components/common/EmptyState';
import { Pagination } from '../../../components/common/Pagination';
import { UploadDocumentModal } from '../../../components/documents/UploadDocumentModal';
import { Button, PageHeader, Table } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { useDocumentVault } from './useDocumentVault';
import { DocumentStats } from './DocumentStats';
import { DocumentFilters } from './DocumentFilters';
import { DocumentGrid } from './DocumentGrid';
import { getDocumentColumns } from './documentColumns';

export const DocumentVault = () => {
  const view = useDocumentVault();
  const { isFirmAdmin, isClient, viewMode, docs, pagination, page, setPage, isLoading, isFetching, refetch, clients } = view;
  const { isUploadModalOpen, setIsUploadModalOpen } = view;

  const uploadButton = (
    <Button variant="primary" icon={CloudUpload} onClick={() => setIsUploadModalOpen(true)}>
      Upload
    </Button>
  );
  const empty = (
    <EmptyState
      icon={FolderOpen}
      title="No documents here"
      description="Try another category or search, or upload the first file."
      action={uploadButton}
    />
  );
  const pager =
    pagination?.totalPages > 1 ? (
      <Pagination currentPage={page} totalPages={pagination.totalPages} totalRecords={pagination.totalRecords} limit={12} onPageChange={setPage} />
    ) : null;

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Documents"
        description={
          isFirmAdmin
            ? 'Every return, audit report and KYC file across your firm, in one secure place.'
            : isClient
              ? 'Documents your CA firm has shared with you.'
              : 'Documents for the clients and tasks you work on.'
        }
        actions={
          <>
            <Button size="icon" aria-label="Refresh" title="Refresh" onClick={() => refetch()}>
              <RefreshCw className={cn('w-4 h-4', isFetching && 'animate-spin')} />
            </Button>
            {uploadButton}
          </>
        }
      />

      <DocumentStats {...view} />

      <DocumentFilters {...view} />

      {viewMode === 'grid' ? (
        isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : docs.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface">{empty}</div>
        ) : (
          <>
            <DocumentGrid {...view} />
            {pager && <div className="rounded-2xl border border-line bg-surface overflow-hidden">{pager}</div>}
          </>
        )
      ) : (
        <Table columns={getDocumentColumns(view)} data={docs} isLoading={isLoading} emptyState={empty} footer={pager} />
      )}

      <UploadDocumentModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} clients={clients} canMarkConfidential={!isClient} />
    </div>
  );
};
