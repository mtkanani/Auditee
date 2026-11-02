import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDebounce } from '../../../hooks/useDebounce';
import { useFirmInvoices } from '../../../queries/useInvoices';

export const useBillingManagement = () => {
  // Filters
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Modals
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(Boolean(location.state?.openCreate));
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  const { invoices, pagination, summary, isLoading, error: invoicesError } = useFirmInvoices({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    invoiceType: typeFilter || undefined,
    status: statusFilter || undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, typeFilter, statusFilter]);

  useEffect(() => {
    if (invoicesError) {
      toast.error('Failed to load billing & invoices');
    }
  }, [invoicesError]);

  const openInvoice = (invoice) => {
    setSelectedInvoiceId(invoice.id);
    setIsDetailModalOpen(true);
  };

  return {
    search, setSearch,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    page, setPage,
    invoices, pagination, summary, isLoading,
    selectedInvoiceId, openInvoice,
    isDetailModalOpen, setIsDetailModalOpen,
    isCreateModalOpen, setIsCreateModalOpen,
    isBankModalOpen, setIsBankModalOpen,
  };
};
