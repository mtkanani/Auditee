import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDebounce } from '../../../hooks/useDebounce';
import { useLeads, useCreateLead, useUpdateLeadStage } from '../../../queries/useLeads';

export const useLeadManagement = () => {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'

  // Filters & Selected Lead
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [stageFilter, setStageFilter] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const location = useLocation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(Boolean(location.state?.openCreate));

  // New Lead Form State
  const [leadName, setLeadName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [interestedServices, setInterestedServices] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [source, setSource] = useState('DIRECT');
  const [notes, setNotes] = useState('');

  const [page, setPage] = useState(1);

  // The kanban needs every lead to fill its stage columns; only the table pages.
  const {
    leads,
    pagination,
    summary,
    isLoading,
    error,
  } = useLeads({
    ...(viewMode === 'table' ? { page, limit: 10 } : {}),
    search: debouncedSearch || undefined,
    stage: stageFilter || undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, stageFilter, viewMode]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load CRM leads');
    }
  }, [error]);

  const updateStageMutation = useUpdateLeadStage();
  const createLeadMutation = useCreateLead();

  const handleStageUpdate = (leadId, newStage) => {
    updateStageMutation.mutate({ id: leadId, stage: newStage });
  };

  const handleAddLeadSubmit = (e) => {
    e.preventDefault();
    if (!leadName.trim() || !email.trim()) {
      toast.error('Lead Contact Name and Email are required');
      return;
    }
    createLeadMutation.mutate(
      {
        leadName: leadName.trim(),
        companyName: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        businessType: businessType.trim(),
        interestedServices: interestedServices.trim(),
        estimatedValue: estimatedValue ? parseFloat(estimatedValue) : 0,
        source,
        notes: notes.trim(),
      },
      {
        onSuccess: () => {
          setIsAddModalOpen(false);
          setLeadName('');
          setCompanyName('');
          setEmail('');
          setPhone('');
          setInterestedServices('');
          setEstimatedValue('');
          setNotes('');
        },
      }
    );
  };

  // Metrics calculation
  // Computed server-side over every matching lead, so they don't change with the page
  const totalLeads = summary?.total || 0;
  const inDiscussionCount = summary?.stageCounts?.DISCUSSION || 0;
  const proposalSentCount = summary?.stageCounts?.PROPOSAL_SENT || 0;
  const wonValueTotal = summary?.wonValue || 0;

  return {
    viewMode,
    setViewMode,
    search,
    setSearch,
    stageFilter,
    setStageFilter,
    selectedLeadId,
    setSelectedLeadId,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isAddModalOpen,
    setIsAddModalOpen,
    leadName,
    setLeadName,
    companyName,
    setCompanyName,
    email,
    setEmail,
    phone,
    setPhone,
    businessType,
    setBusinessType,
    interestedServices,
    setInterestedServices,
    estimatedValue,
    setEstimatedValue,
    source,
    setSource,
    notes,
    setNotes,
    page,
    setPage,
    leads,
    pagination,
    isLoading,
    createLeadMutation,
    handleStageUpdate,
    handleAddLeadSubmit,
    totalLeads,
    inDiscussionCount,
    proposalSentCount,
    wonValueTotal,
  };
};
