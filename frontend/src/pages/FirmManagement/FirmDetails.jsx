import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, MapPin, Calendar, Users, 
  Briefcase, CheckSquare, Layers, ShieldCheck, Edit,
  KeyRound, ShieldAlert, CheckCircle2, UserCheck
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useFirm } from '../../hooks/useFirm';
import StatusModal from '../../components/FirmManagement/StatusModal';
import ResetPasswordModal from '../../components/FirmManagement/ResetPasswordModal';

const FirmDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getFirmById, changeFirmStatus, resetFirmAdminPassword, loading, currentFirm } = useFirm();

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  useEffect(() => {
    if (id) {
      getFirmById(id);
    }
  }, [id, getFirmById]);

  const handleStatusConfirm = async (newStatus) => {
    if (currentFirm) {
      const success = await changeFirmStatus(currentFirm.id, newStatus);
      if (success) {
        setIsStatusOpen(false);
        getFirmById(id);
      }
    }
  };

  const handleResetConfirm = async (newPassword) => {
    if (currentFirm) {
      const success = await resetFirmAdminPassword(currentFirm.id, newPassword);
      if (success) {
        setIsResetOpen(false);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        );
      case 'INACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-500/10 border border-slate-500/20 px-3 py-1 rounded-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Inactive
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-500/10 border border-slate-500/20 px-3 py-1 rounded-xl">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Mock numbers for practice analytics
  const analytics = [
    { label: 'Total Users', value: 12, icon: Users, color: 'text-indigo-400 border-indigo-500/25 bg-indigo-500/5' },
    { label: 'Total Employees', value: 8, icon: Briefcase, color: 'text-teal-400 border-teal-500/25 bg-teal-500/5' },
    { label: 'Total Clients', value: 25, icon: Layers, color: 'text-blue-400 border-blue-500/25 bg-blue-500/5' },
    { label: 'Pending Tasks', value: 4, icon: CheckSquare, color: 'text-amber-400 border-amber-500/25 bg-amber-500/5' },
  ];

  return (
    <DashboardLayout title="Firm Details">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Breadcrumb and Back */}
        <div className="flex items-center justify-between">
          <nav className="text-xs text-slate-500 font-semibold tracking-wide">
            <span className="hover:text-slate-350 cursor-pointer" onClick={() => navigate('/profile')}>Dashboard</span>
            <span className="mx-2 text-slate-700">/</span>
            <span className="hover:text-slate-350 cursor-pointer" onClick={() => navigate('/admin/firms')}>Firm Management</span>
            <span className="mx-2 text-slate-700">/</span>
            <span className="text-slate-300">Details</span>
          </nav>
          
          <button
            onClick={() => navigate('/admin/firms')}
            className="flex items-center gap-2 px-3.5 py-2 border border-slate-800 hover:bg-slate-900 text-xs font-bold text-slate-300 rounded-xl transition-all"
          >
            <ArrowLeft size={14} />
            Back to List
          </button>
        </div>

        {loading || !currentFirm ? (
          <div className="flex flex-col items-center justify-center py-24 bg-slate-900/30 border border-slate-800 rounded-2xl">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs text-slate-400 font-medium">Fetching details...</span>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* ── HERO CARD ── */}
            <div className="relative overflow-hidden bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-gradient-to-tr from-brand-900/10 via-indigo-900/5 to-slate-900/45">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">
                    {currentFirm.firmName}
                  </h1>
                  {getStatusBadge(currentFirm.status)}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2.5">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-500" />
                    Created on {formatDate(currentFirm.createdAt)}
                  </span>
                  <span className="text-slate-750">|</span>
                  <span className="flex items-center gap-1.5 font-mono">
                    <Mail size={13} className="text-slate-500" />
                    {currentFirm.email}
                  </span>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => navigate(`/admin/firms/${currentFirm.id}/edit`)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-350 hover:text-white transition-all"
                >
                  <Edit size={14} />
                  Edit details
                </button>
                <button
                  onClick={() => setIsStatusOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-350 hover:text-white transition-all"
                >
                  <CheckCircle2 size={14} className="text-brand-400" />
                  Change Status
                </button>
                <button
                  onClick={() => setIsResetOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-350 hover:text-white transition-all"
                >
                  <KeyRound size={14} className="text-amber-400" />
                  Reset Admin Pwd
                </button>
              </div>
            </div>

            {/* ── GRID DETAILS SECTION ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Firm Info (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
                  <h3 className="text-base font-bold text-white mb-5 pb-3 border-b border-slate-800/80">
                    Firm Workspace Details
                  </h3>

                  <div className="space-y-4">
                    {/* Phone */}
                    <div className="flex gap-4">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-slate-400 h-fit">
                        <Phone size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Phone Number</span>
                        <span className="text-sm font-semibold text-slate-200 mt-0.5 block">{currentFirm.phone || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex gap-4">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-slate-400 h-fit">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Location Address</span>
                        <span className="text-sm font-semibold text-slate-200 mt-0.5 block leading-relaxed">
                          {[
                            currentFirm.address,
                            currentFirm.city,
                            currentFirm.state,
                            currentFirm.country,
                            currentFirm.pincode ? `PIN ${currentFirm.pincode}` : null
                          ].filter(Boolean).join(', ') || 'No address specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {analytics.map((card, i) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={i}
                        className={`rounded-2xl border p-4.5 flex flex-col justify-between h-28 transition-all ${card.color}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold opacity-80">{card.label}</span>
                          <Icon size={16} className="opacity-70" />
                        </div>
                        <h4 className="text-3xl font-extrabold text-white">{card.value}</h4>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Firm Admin Card (5 cols) */}
              <div className="lg:col-span-5 h-full">
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md text-center h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white mb-5 pb-3 border-b border-slate-800/80 text-left">
                      Primary Administrator
                    </h3>

                    {/* Avatar Display */}
                    <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 border border-slate-800 flex items-center justify-center text-white text-3xl font-black shadow-glow-indigo/10 mt-2 mb-4">
                      {currentFirm.firmAdmin?.firstName ? currentFirm.firmAdmin.firstName[0].toUpperCase() : 'A'}
                    </div>

                    <h4 className="text-lg font-bold text-white tracking-tight">
                      {currentFirm.firmAdmin ? `${currentFirm.firmAdmin.firstName} ${currentFirm.firmAdmin.lastName}` : 'N/A'}
                    </h4>
                    <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-md border border-brand-500/20 bg-brand-500/5 text-brand-400 text-[10px] font-bold uppercase tracking-wider">
                      {currentFirm.firmAdmin?.role || 'FIRM_ADMIN'}
                    </span>
                  </div>

                  <div className="border-t border-slate-800/60 pt-4 mt-6 text-left space-y-3.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-500" />
                      <span className="truncate">{currentFirm.firmAdmin?.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-500" />
                      <span>{currentFirm.firmAdmin?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* Modals */}
      <StatusModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        onConfirm={handleStatusConfirm}
        currentStatus={currentFirm?.status}
        firmName={currentFirm?.firmName}
      />

      <ResetPasswordModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleResetConfirm}
        adminEmail={currentFirm?.firmAdmin?.email}
      />
    </DashboardLayout>
  );
};

export default FirmDetails;
