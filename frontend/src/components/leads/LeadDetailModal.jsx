import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import {
  FiPhone,
  FiFileText,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiBriefcase,
  FiCheckCircle,
  FiPlus,
  FiClock,
  FiSend,
  FiZap,
} from 'react-icons/fi';
import { leadService } from '../../services/leadService';
import toast from 'react-hot-toast';

export const LeadDetailModal = ({ leadId, isOpen, onClose, onRefresh }) => {
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'calls' | 'meetings' | 'proposals'

  // Form states
  const [callSummary, setCallSummary] = useState('');
  const [callDuration, setCallDuration] = useState('15');
  const [callFollowUp, setCallFollowUp] = useState('');

  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [meetingAttendees, setMeetingAttendees] = useState('');

  const [proposalTitle, setProposalTitle] = useState('');
  const [proposedFee, setProposedFee] = useState('');
  const [billingFrequency, setBillingFrequency] = useState('MONTHLY');
  const [proposalScope, setProposalScope] = useState('');

  const fetchLeadDetails = async () => {
    if (!leadId) return;
    setIsLoading(true);
    try {
      const res = await leadService.getLeadById(leadId);
      setLead(res.data);
    } catch (err) {
      toast.error('Failed to load lead details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && leadId) {
      fetchLeadDetails();
    }
  }, [isOpen, leadId]);

  const handleStageChange = async (newStage) => {
    try {
      await leadService.updateLeadStage(leadId, newStage);
      toast.success(`Pipeline stage updated to ${newStage}`);
      fetchLeadDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to update stage');
    }
  };

  const handleAddCallSubmit = async (e) => {
    e.preventDefault();
    if (!callSummary.trim()) return;
    try {
      await leadService.addCallLog(leadId, {
        callSummary: callSummary.trim(),
        durationMinutes: parseInt(callDuration, 10),
        followUpDate: callFollowUp || null,
      });
      toast.success('Call log recorded!');
      setCallSummary('');
      setCallFollowUp('');
      fetchLeadDetails();
    } catch (err) {
      toast.error(err.message || 'Failed to log call');
    }
  };

  const handleAddMeetingSubmit = async (e) => {
    e.preventDefault();
    if (!meetingTitle.trim() || !meetingNotes.trim()) return;
    try {
      await leadService.addMeetingNote(leadId, {
        meetingTitle: meetingTitle.trim(),
        meetingNotes: meetingNotes.trim(),
        attendees: meetingAttendees.trim(),
      });
      toast.success('Meeting notes saved!');
      setMeetingTitle('');
      setMeetingNotes('');
      setMeetingAttendees('');
      fetchLeadDetails();
    } catch (err) {
      toast.error(err.message || 'Failed to save meeting notes');
    }
  };

  const handleAddProposalSubmit = async (e) => {
    e.preventDefault();
    if (!proposalTitle.trim() || !proposedFee) return;
    try {
      await leadService.addProposal(leadId, {
        proposalTitle: proposalTitle.trim(),
        proposedFee: parseFloat(proposedFee),
        billingFrequency,
        scopeDescription: proposalScope.trim(),
      });
      toast.success('Proposal quotation attached!');
      setProposalTitle('');
      setProposedFee('');
      setProposalScope('');
      fetchLeadDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to attach proposal');
    }
  };

  const handleConvertToClient = async () => {
    try {
      const res = await leadService.convertToClient(leadId);
      toast.success('⚡ Lead converted to Master Client successfully!');
      fetchLeadDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to convert lead');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lead ? `CRM Lead: ${lead.leadName} (${lead.companyName || 'Individual'})` : 'Loading Lead...'}
      maxWidth="max-w-4xl"
    >
      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading Lead CRM Details...</div>
      ) : lead ? (
        <div className="space-y-6">
          {/* Header Card with Pipeline Stage & Actions */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-extrabold text-white text-lg shadow-lg">
                {lead.leadName.charAt(0)}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-100 text-base">{lead.leadName}</h3>
                <p className="text-xs text-slate-400">
                  {lead.companyName ? `${lead.companyName} • ` : ''}
                  {lead.email} • {lead.phone || 'No Phone'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                    Est. Value: ₹{Number(lead.estimatedValue || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400">Source: {lead.source || 'DIRECT'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Pipeline Stage</span>
                <select
                  value={lead.stage}
                  onChange={(e) => handleStageChange(e.target.value)}
                  className="text-xs font-bold bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-indigo-400 focus:outline-none focus:border-indigo-500"
                >
                  <option value="NEW_LEAD">NEW LEAD</option>
                  <option value="DISCUSSION">DISCUSSION</option>
                  <option value="PROPOSAL_SENT">PROPOSAL SENT</option>
                  <option value="WON">WON</option>
                  <option value="LOST">LOST</option>
                </select>
              </div>

              {lead.stage !== 'WON' ? (
                <button
                  onClick={handleConvertToClient}
                  className="w-full sm:w-auto py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5"
                >
                  <FiZap className="w-4 h-4" />
                  <span>Convert to Client</span>
                </button>
              ) : (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-extrabold flex items-center gap-1">
                  <FiCheckCircle /> Converted to Client
                </span>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            {[
              { id: 'overview', label: 'Lead Overview', icon: FiUser },
              { id: 'calls', label: `Call History (${lead.callLogs?.length || 0})`, icon: FiPhone },
              { id: 'meetings', label: `Meeting Notes (${lead.meetingNotes?.length || 0})`, icon: FiCalendar },
              { id: 'proposals', label: `Proposals (${lead.proposals?.length || 0})`, icon: FiFileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider">Contact & Business Profile</h4>
                <div className="text-xs text-slate-300 space-y-2">
                  <p><strong className="text-slate-400">Name:</strong> {lead.leadName}</p>
                  <p><strong className="text-slate-400">Company:</strong> {lead.companyName || 'N/A'}</p>
                  <p><strong className="text-slate-400">Business Type:</strong> {lead.businessType || 'N/A'}</p>
                  <p><strong className="text-slate-400">Email:</strong> {lead.email}</p>
                  <p><strong className="text-slate-400">Phone:</strong> {lead.phone || 'N/A'}</p>
                  <p><strong className="text-slate-400">GSTIN / PAN:</strong> {lead.gstNumber || lead.panNumber || 'N/A'}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider">Services Required & Notes</h4>
                <div className="text-xs text-slate-300 space-y-2">
                  <p><strong className="text-slate-400">Interested CA Services:</strong></p>
                  <p className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 text-indigo-300 font-semibold">
                    {lead.interestedServices || 'General Audit & Compliance Services'}
                  </p>
                  <p><strong className="text-slate-400">Lead Notes:</strong></p>
                  <p className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-slate-300">
                    {lead.notes || 'No specific notes recorded for this lead.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CALL HISTORY */}
          {activeTab === 'calls' && (
            <div className="space-y-4">
              <form onSubmit={handleAddCallSubmit} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <FiPhone className="text-indigo-400" /> Log Phone Conversation
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Call summary / conversation notes..."
                      value={callSummary}
                      onChange={(e) => setCallSummary(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Duration (mins)"
                      value={callDuration}
                      onChange={(e) => setCallDuration(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Next Follow-Up Date:</span>
                    <input
                      type="date"
                      value={callFollowUp}
                      onChange={(e) => setCallFollowUp(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-1.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg"
                  >
                    Save Call Log
                  </button>
                </div>
              </form>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {lead.callLogs?.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Logged by {log.loggedName} • {log.durationMinutes ? `${log.durationMinutes} mins` : 'Call'}</span>
                      <span>{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200">{log.callSummary}</p>
                    {log.followUpDate && (
                      <p className="text-[10px] text-amber-400 font-bold">
                        📅 Next Follow-Up Scheduled: {new Date(log.followUpDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MEETING NOTES */}
          {activeTab === 'meetings' && (
            <div className="space-y-4">
              <form onSubmit={handleAddMeetingSubmit} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <FiCalendar className="text-purple-400" /> Record Consultation Meeting Notes
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Meeting Agenda / Title *"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                  />
                  <input
                    type="text"
                    placeholder="Attendees (e.g. CA Rahul, Client CFO)"
                    value={meetingAttendees}
                    onChange={(e) => setMeetingAttendees(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
                <textarea
                  required
                  rows={2}
                  placeholder="Detailed meeting notes & client requirements..."
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                />
                <button
                  type="submit"
                  className="py-1.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg"
                >
                  Save Meeting Notes
                </button>
              </form>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {lead.meetingNotes?.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-purple-400">{m.meetingTitle}</span>
                      <span>{new Date(m.meetingDate).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-300">{m.meetingNotes}</p>
                    {m.attendees && <p className="text-[10px] text-slate-500">Attendees: {m.attendees}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROPOSALS & QUOTATIONS */}
          {activeTab === 'proposals' && (
            <div className="space-y-4">
              <form onSubmit={handleAddProposalSubmit} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <FiDollarSign className="text-emerald-400" /> Attach Fee Quotation / Proposal
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Proposal Title (e.g. Annual Audit & Tax Filing Quotation)"
                      value={proposalTitle}
                      onChange={(e) => setProposalTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      required
                      placeholder="Proposed Fee (₹)"
                      value={proposedFee}
                      onChange={(e) => setProposedFee(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                    />
                  </div>
                </div>
                <textarea
                  rows={2}
                  placeholder="Scope of work & payment terms description..."
                  value={proposalScope}
                  onChange={(e) => setProposalScope(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                />
                <button
                  type="submit"
                  className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg"
                >
                  Save & Update Stage to PROPOSAL SENT
                </button>
              </form>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {lead.proposals?.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-100 text-xs">{p.proposalTitle}</span>
                      <span className="text-xs font-bold text-emerald-400">
                        ₹{Number(p.proposedFee || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{p.scopeDescription || 'Standard CA engagement terms'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </Modal>
  );
};
