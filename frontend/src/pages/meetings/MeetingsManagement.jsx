import React, { useState, useMemo } from 'react';
import { Calendar, Plus, Search, Video, Clock, Users, CheckCircle, FileText, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMeetings, useJoinMeeting, useUpdateMeetingStatus } from '../../queries/useMeetings';
import { useDebounce } from '../../hooks/useDebounce';
import ScheduleMeetingModal from '../../components/meetings/ScheduleMeetingModal';
import InAppVideoRoom from '../../components/meetings/InAppVideoRoom';
import MeetingNotesEditor from '../../components/meetings/MeetingNotesEditor';

export const MeetingsManagement = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [activeVideoMeeting, setActiveVideoMeeting] = useState(null);
  const [activeNotesMeeting, setActiveNotesMeeting] = useState(null);

  const filters = useMemo(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (statusFilter) params.status = statusFilter;
    if (typeFilter) params.type = typeFilter;
    return params;
  }, [debouncedSearch, statusFilter, typeFilter]);

  const { meetings, isLoading } = useMeetings(filters);
  const joinMeetingMutation = useJoinMeeting();
  const updateStatusMutation = useUpdateMeetingStatus();

  const handleJoinMeeting = async (meeting) => {
    try {
      await joinMeetingMutation.mutateAsync(meeting.id);
      if (meeting.meetingMode === 'IN_APP_VIDEO') {
        setActiveVideoMeeting(meeting);
      } else if (meeting.meetingLink) {
        const fullUrl = meeting.meetingLink.startsWith('http') ? meeting.meetingLink : `https://${meeting.meetingLink}`;
        window.open(fullUrl, '_blank');
      } else {
        toast.success(`Meeting location: ${meeting.location || 'In-Person'}`);
      }
    } catch {
      // toast handled in mutation
    }
  };

  const handleCloseMeeting = (meetingId) => {
    updateStatusMutation.mutate({ id: meetingId, status: 'COMPLETED' });
  };

  const canSchedule = true; // Allow any firm user, employee, and client to schedule meetings

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-100">Meetings & Video Calls</h1>
            <p className="text-xs text-slate-400">Schedule meetings, join video rooms, and record AI MoM action items</p>
          </div>
        </div>

        {canSchedule && (
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Meeting</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/60 p-4 border border-slate-800/80 rounded-2xl">
        <div className="relative col-span-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search meeting title or agenda..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Meeting Types</option>
            <option value="CLIENT">Client Meetings</option>
            <option value="INTERNAL">Internal Team</option>
            <option value="AUDIT_REVIEW">Audit Review</option>
            <option value="TASK_DISCUSSION">Task Discussion</option>
          </select>
        </div>
      </div>

      {/* Active MoM Notes Drawer (if selected) */}
      {activeNotesMeeting && (
        <div className="relative">
          <button
            onClick={() => setActiveNotesMeeting(null)}
            className="absolute right-4 top-4 text-xs text-slate-400 hover:text-slate-200"
          >
            Close Notes
          </button>
          <MeetingNotesEditor meeting={activeNotesMeeting} onRefresh={() => {}} />
        </div>
      )}

      {/* Meetings Grid Cards */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 text-xs">Loading meetings...</div>
      ) : meetings.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800/60 rounded-2xl text-slate-400 text-xs">
          No meetings found. {canSchedule && 'Click "Schedule Meeting" to create one!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meetings.map((meeting) => {
            const statusUpper = (meeting.status || '').toUpperCase();
            const isClosed = statusUpper === 'COMPLETED' || statusUpper === 'CANCELLED';
            const isLive = !isClosed && (statusUpper === 'IN_PROGRESS' || (new Date(meeting.startTime) <= new Date() && new Date(meeting.endTime) >= new Date()));

            return (
              <div
                key={meeting.id}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 p-5 rounded-2xl shadow-lg flex flex-col justify-between transition-all"
              >
                <div>
                  {/* Card Header & Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                      {meeting.meetingType.replace('_', ' ')}
                    </span>
                    {isClosed ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        COMPLETED
                      </span>
                    ) : isLive ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        LIVE NOW
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">{meeting.status}</span>
                    )}
                  </div>

                  {/* Title & Agenda */}
                  <h3 className="text-sm font-bold text-slate-100 mb-1">{meeting.title}</h3>
                  {meeting.agenda && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">{meeting.agenda}</p>
                  )}

                  {/* Metadata Info */}
                  <div className="space-y-1.5 text-[11px] text-slate-400 border-t border-b border-slate-800/80 py-3 my-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>
                        {new Date(meeting.meetingDate).toLocaleDateString()} • {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="capitalize">{meeting.meetingMode.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{meeting.participants?.length || 0} Invited Participants</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-2">
                  {!isClosed ? (
                    <button
                      onClick={() => handleJoinMeeting(meeting)}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Join Meeting</span>
                    </button>
                  ) : (
                    <span className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Meeting Closed</span>
                    </span>
                  )}

                  <button
                    onClick={() => setActiveNotesMeeting(meeting)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Minutes of Meeting (MoM) Notes"
                  >
                    <FileText className="w-4 h-4" />
                  </button>

                  {canSchedule && !isClosed && (
                    <button
                      onClick={() => handleCloseMeeting(meeting.id)}
                      className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                      title="Mark Meeting as Completed / Closed"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="hidden sm:inline">Close</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Meeting Modal */}
      <ScheduleMeetingModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
      />

      {/* In-App WebRTC Video Call Room Modal */}
      {activeVideoMeeting && (
        <InAppVideoRoom
          meeting={activeVideoMeeting}
          onClose={() => setActiveVideoMeeting(null)}
        />
      )}
    </div>
  );
};

export default MeetingsManagement;
