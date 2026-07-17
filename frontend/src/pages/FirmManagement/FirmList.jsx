import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, SlidersHorizontal, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import FirmStats from '../../components/FirmManagement/FirmStats';
import FirmTable from '../../components/FirmManagement/FirmTable';
import StatusModal from '../../components/FirmManagement/StatusModal';
import DeleteModal from '../../components/FirmManagement/DeleteModal';
import ResetPasswordModal from '../../components/FirmManagement/ResetPasswordModal';
import { useFirm } from '../../hooks/useFirm';

const FirmList = () => {
  const navigate = useNavigate();
  const {
    firms,
    loading,
    pagination,
    getFirms,
    changeFirmStatus,
    resetFirmAdminPassword,
    deleteFirm,
  } = useFirm();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Global Counts for Stats Cards
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, suspended: 0 });

  // Modal State
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Fetch overall statistics for the cards
  const fetchStats = useCallback(async () => {
    try {
      const res = await getFirms({ page: 1, limit: 1000 });
      if (res && res.data) {
        const data = res.data;
        const total = data.length;
        const active = data.filter((f) => f.status === 'ACTIVE').length;
        const inactive = data.filter((f) => f.status === 'INACTIVE').length;
        const suspended = data.filter((f) => f.status === 'SUSPENDED').length;
        setStats({ total, active, inactive, suspended });
      }
    } catch (e) {
      console.error('Error fetching statistics', e);
    }
  }, [getFirms]);

  // Load paginated list of firms
  const loadFirms = useCallback(() => {
    getFirms({
      page,
      limit,
      search: searchTerm.trim() || undefined,
      status: statusFilter || undefined,
    });
  }, [getFirms, page, limit, searchTerm, statusFilter]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    loadFirms();
  }, [loadFirms]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  // Status Change handlers
  const openStatusModal = (firm) => {
    setSelectedFirm(firm);
    setIsStatusOpen(true);
  };

  const handleStatusConfirm = async (newStatus) => {
    if (selectedFirm) {
      const success = await changeFirmStatus(selectedFirm.id, newStatus);
      if (success) {
        setIsStatusOpen(false);
        setSelectedFirm(null);
        loadFirms();
        fetchStats();
      }
    }
  };

  // Reset password handlers
  const openResetModal = (firm) => {
    setSelectedFirm(firm);
    setIsResetOpen(true);
  };

  const handleResetConfirm = async (newPassword) => {
    if (selectedFirm) {
      const success = await resetFirmAdminPassword(selectedFirm.id, newPassword);
      if (success) {
        setIsResetOpen(false);
        setSelectedFirm(null);
      }
    }
  };

  // Delete handlers
  const openDeleteModal = (firm) => {
    setSelectedFirm(firm);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedFirm) {
      const success = await deleteFirm(selectedFirm.id);
      if (success) {
        setIsDeleteOpen(false);
        setSelectedFirm(null);
        loadFirms();
        fetchStats();
      }
    }
  };

  return (
    <DashboardLayout title="Firm Management">
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-slate-500 font-semibold tracking-wide">
          <span className="hover:text-slate-350 cursor-pointer" onClick={() => navigate('/profile')}>Dashboard</span>
          <span className="mx-2 text-slate-700">/</span>
          <span className="text-slate-300">Firm Management</span>
        </nav>

        {/* Analytics Statistics Row */}
        <FirmStats stats={stats} />

        {/* Filters and Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-slate-900/30 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
          {/* Left: Search and Filters */}
          <div className="flex flex-1 flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search firm by name, email, phone..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <SlidersHorizontal size={14} />
              </span>
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="pl-10 pr-8 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-brand-500 transition-colors appearance-none min-w-[150px] cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active Only</option>
                <option value="INACTIVE">Inactive Only</option>
                <option value="SUSPENDED">Suspended Only</option>
              </select>
            </div>
          </div>

          {/* Right: Add button */}
          <button
            onClick={() => navigate('/admin/firms/create')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-brand-500/10"
          >
            <Plus size={16} />
            Add New Firm
          </button>
        </div>

        {/* Data Table Component */}
        <div className="relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 border border-slate-800 rounded-2xl">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-xs text-slate-400 font-medium">Loading firms list...</span>
            </div>
          ) : (
            <FirmTable
              firms={firms}
              onStatusChange={openStatusModal}
              onResetPassword={openResetModal}
              onDelete={openDeleteModal}
            />
          )}
        </div>

        {/* Pagination Row */}
        {!loading && firms.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs">
            <span className="text-slate-500">
              Showing page <strong className="text-white font-bold">{pagination.currentPage}</strong> of <strong className="text-white font-bold">{pagination.totalPages}</strong> ({pagination.totalRecords} total records)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white rounded-xl disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="p-2 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white rounded-xl disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <StatusModal
        isOpen={isStatusOpen}
        onClose={() => {
          setIsStatusOpen(false);
          setSelectedFirm(null);
        }}
        onConfirm={handleStatusConfirm}
        currentStatus={selectedFirm?.status}
        firmName={selectedFirm?.firmName}
      />

      <ResetPasswordModal
        isOpen={isResetOpen}
        onClose={() => {
          setIsResetOpen(false);
          setSelectedFirm(null);
        }}
        onConfirm={handleResetConfirm}
        adminEmail={selectedFirm?.firmAdmin?.email || selectedFirm?.email}
      />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedFirm(null);
        }}
        onConfirm={handleDeleteConfirm}
        firmName={selectedFirm?.firmName}
      />
    </DashboardLayout>
  );
};

export default FirmList;
