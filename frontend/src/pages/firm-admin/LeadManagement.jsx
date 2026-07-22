import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatsCard } from '../../components/common/StatsCard';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { LeadDetailModal } from '../../components/leads/LeadDetailModal';
import {
  FiUsers,
  FiMessageSquare,
  FiFileText,
  FiCheckCircle,
  FiPlus,
  FiGrid,
  FiList,
  FiPhone,
  FiZap,
  FiDollarSign,
  FiArrowRight,
} from 'react-icons/fi';
import { leadService } from '../../services/leadService';
import toast from 'react-hot-toast';

export const LeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'

  // Filters & Selected Lead
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await leadService.getAllLeads({ search, stage: stageFilter || undefined });
      setLeads(res.data || []);
    } catch (err) {
      toast.error('Failed to load CRM leads');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search, stageFilter]);

  const handleStageUpdate = async (leadId, newStage) => {
    try {
      await leadService.updateLeadStage(leadId, newStage);
      toast.success(`Pipeline stage updated to ${newStage}`);
      fetchLeads();
    } catch (err) {
      toast.error(err.message || 'Failed to update stage');
    }
  };

  const handleAddLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadName.trim() || !email.trim()) {
      toast.error('Lead Contact Name and Email are required');
      return;
    }
    try {
      await leadService.createLead({
        leadName: leadName.trim(),
        companyName: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        businessType: businessType.trim(),
        interestedServices: interestedServices.trim(),
        estimatedValue: estimatedValue ? parseFloat(estimatedValue) : 0,
        source,
        notes: notes.trim(),
      });
      toast.success('New Lead added to CRM Pipeline!');
      setIsAddModalOpen(false);
      setLeadName('');
      setCompanyName('');
      setEmail('');
      setPhone('');
      setInterestedServices('');
      setEstimatedValue('');
      setNotes('');
      fetchLeads();
    } catch (err) {
      toast.error(err.message || 'Failed to create lead');
    }
  };

  // Metrics calculation
  const totalLeads = leads.length;
  const inDiscussionCount = leads.filter((l) => l.stage === 'DISCUSSION').length;
  const proposalSentCount = leads.filter((l) => l.stage === 'PROPOSAL_SENT').length;
  const wonValueTotal = leads
    .filter((l) => l.stage === 'WON')
    .reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

  const pipelineStages = [
    { key: 'NEW_LEAD', title: 'NEW INQUIRY', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
    { key: 'DISCUSSION', title: 'IN DISCUSSION', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
    { key: 'PROPOSAL_SENT', title: 'PROPOSAL SENT', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
    { key: 'WON', title: 'WON & CONVERTED', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
    { key: 'LOST', title: 'LOST / DROPPED', color: 'border-rose-500/40 text-rose-400 bg-rose-500/10' },
  ];

  const columns = [
    {
      header: 'Lead Name & Company',
      key: 'leadName',
      render: (r) => (
        <div
          onClick={() => {
            setSelectedLeadId(r.id);
            setIsDetailModalOpen(true);
          }}
          className="cursor-pointer group"
        >
          <p className="font-extrabold text-slate-100 group-hover:text-indigo-400 transition-colors">{r.leadName}</p>
          <p className="text-xs text-slate-400">{r.companyName || 'Individual'} • {r.email}</p>
        </div>
      ),
    },
    { header: 'Phone', key: 'phone', render: (r) => r.phone || 'N/A' },
    { header: 'Interested Services', key: 'interestedServices', render: (r) => r.interestedServices || 'General CA Audit' },
    {
      header: 'Est. Value',
      key: 'estimatedValue',
      render: (r) => <span className="font-bold text-emerald-400">₹{Number(r.estimatedValue || 0).toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Stage',
      key: 'stage',
      render: (r) => (
        <select
          value={r.stage}
          onChange={(e) => handleStageUpdate(r.id, e.target.value)}
          className="text-xs font-bold bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-indigo-400 focus:outline-none"
        >
          <option value="NEW_LEAD">NEW LEAD</option>
          <option value="DISCUSSION">DISCUSSION</option>
          <option value="PROPOSAL_SENT">PROPOSAL SENT</option>
          <option value="WON">WON</option>
          <option value="LOST">LOST</option>
        </select>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (r) => (
        <button
          onClick={() => {
            setSelectedLeadId(r.id);
            setIsDetailModalOpen(true);
          }}
          className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600/30 text-xs font-bold"
        >
          Manage CRM
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lead Management (CRM)"
        subtitle="Track potential clients, log calls & meetings, issue proposals, and convert inquiries into Master Clients"
        actions={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add New Lead</span>
          </button>
        }
      />

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard title="Total Active Leads" value={totalLeads} icon={FiUsers} color="indigo" />
        <StatsCard title="Leads in Discussion" value={inDiscussionCount} icon={FiMessageSquare} color="purple" />
        <StatsCard title="Proposals Sent" value={proposalSentCount} icon={FiFileText} color="amber" />
        <StatsCard
          title="Converted Won Value"
          value={`₹${wonValueTotal.toLocaleString('en-IN')}`}
          icon={FiCheckCircle}
          color="emerald"
        />
      </div>

      {/* Control Bar: View Toggle & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FiGrid />
            <span>Visual Pipeline Board</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'table' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FiList />
            <span>Lead Master Table</span>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} placeholder="Search lead, company, services..." className="w-full sm:w-64" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
          >
            <option value="">All Pipeline Stages</option>
            <option value="NEW_LEAD">New Inquiry</option>
            <option value="DISCUSSION">Discussion</option>
            <option value="PROPOSAL_SENT">Proposal Sent</option>
            <option value="WON">Won & Converted</option>
            <option value="LOST">Lost</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: VISUAL CRM PIPELINE KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {pipelineStages.map((stage) => {
            const stageLeads = leads.filter((l) => l.stage === stage.key);
            const totalStageValue = stageLeads.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

            return (
              <div key={stage.key} className="flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800 p-3 min-h-[500px]">
                {/* Column Header */}
                <div className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between ${stage.color}`}>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">{stage.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/60">{stageLeads.length}</span>
                </div>

                <div className="text-[10px] text-slate-500 font-bold px-1 mb-2">
                  Total Value: ₹{totalStageValue.toLocaleString('en-IN')}
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {stageLeads.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedLeadId(item.id);
                        setIsDetailModalOpen(true);
                      }}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all space-y-2 shadow-lg group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-semibold">{item.companyName || 'Individual'}</span>
                        <span className="text-[10px] font-extrabold text-emerald-400">
                          ₹{Number(item.estimatedValue || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <h4 className="text-xs font-extrabold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {item.leadName}
                      </h4>
                      <p className="text-[11px] text-indigo-300 line-clamp-1">{item.interestedServices || 'CA Audit Services'}</p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span>📞 {item.phone || item.email}</span>
                        {item.stage === 'WON' ? (
                          <span className="text-emerald-400 font-bold">Converted</span>
                        ) : (
                          <span className="text-slate-500 group-hover:text-indigo-400 flex items-center gap-0.5">
                            Manage <FiArrowRight />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="h-32 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-[11px] text-slate-600">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: MASTER TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <DataTable columns={columns} data={leads} isLoading={isLoading} />
        </div>
      )}

      {/* Lead 360 Detail CRM Hub Modal */}
      <LeadDetailModal
        leadId={selectedLeadId}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onRefresh={fetchLeads}
      />

      {/* Add New Lead Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Lead (Inquiry)">
        <form onSubmit={handleAddLeadSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rajesh Kumar"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Entity Name</label>
              <input
                type="text"
                placeholder="e.g. Apex Tech Solutions"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="rajesh@apextech.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Interested CA Services</label>
              <input
                type="text"
                placeholder="e.g. GST Reg + Tax Audit + Bookkeeping"
                value={interestedServices}
                onChange={(e) => setInterestedServices(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Deal Value (₹)</label>
              <input
                type="number"
                placeholder="e.g. 45000"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Lead Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              >
                <option value="DIRECT">Direct Inquiry / Walk-in</option>
                <option value="REFERRAL">Client Referral</option>
                <option value="WEBSITE">Website / Google</option>
                <option value="COLD_CALL">Cold Call / Email</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Business Type</label>
              <input
                type="text"
                placeholder="e.g. Pvt Ltd, LLP, Sole Prop"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Requirement Details</label>
            <textarea
              rows={2}
              placeholder="Client requirement details, timeline..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg mt-2"
          >
            Create Lead in CRM
          </button>
        </form>
      </Modal>
    </div>
  );
};
