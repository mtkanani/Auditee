import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useConfirm } from '../../../components/common/ConfirmProvider';
import { useVaultDocuments, useDeleteDocument } from '../../../queries/useDocuments';
import { useFirmClients } from '../../../queries/useLookups';
import { useDebounce } from '../../../hooks/useDebounce';

export const useDocumentVault = () => {
  const { user } = useAuth();
  const confirm = useConfirm();
  const isFirmAdmin = user?.role === 'FIRM_ADMIN' || user?.role === 'ADMIN';
  const isClient = user?.role === 'CLIENT';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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

  const canDelete = (doc) => isFirmAdmin || doc.uploadedBy === user?.id;

  const handleDelete = async (doc) => {
    const ok = await confirm({
      title: 'Delete document?',
      message: `"${doc.title}" will be deleted. This can't be undone.`,
      confirmText: 'Delete',
    });
    if (ok) deleteMutation.mutate(doc.id);
  };

  // Stats cover every matching document (computed server-side), not just this page
  const stats = {
    total: summary?.total || 0,
    gst: summary?.gst || 0,
    tax: summary?.tax || 0,
    confidential: summary?.confidential || 0,
  };

  return {
    isFirmAdmin,
    isClient,
    search, setSearch,
    category, setCategory,
    viewMode, setViewMode,
    page, setPage,
    isUploadModalOpen, setIsUploadModalOpen,
    docs, pagination, stats, isLoading, isFetching, refetch,
    clients,
    canDelete, handleDelete,
  };
};
