import React, { useState } from 'react';
import { Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../common/Modal';
import { useScheduleMeeting } from '../../queries/useMeetings';

export const ScheduleMeetingModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    agenda: '',
    meetingType: 'CLIENT',
    meetingMode: 'IN_APP_VIDEO',
    priority: 'MEDIUM',
    department: '',
    location: '',
    meetingLink: '',
    meetingDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    participantEmail: '',
  });

  const scheduleMeetingMutation = useScheduleMeeting();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a meeting title.');
      return;
    }

    const startTimeStr = formData.startTime || '10:00';
    const endTimeStr = formData.endTime || '11:00';

    const startDateTime = new Date(`${formData.meetingDate}T${startTimeStr}:00`);
    const endDateTime = new Date(`${formData.meetingDate}T${endTimeStr}:00`);

    const participants = formData.participantEmail
      ? formData.participantEmail.split(',').map((email) => ({ email: email.trim() }))
      : [];

    scheduleMeetingMutation.mutate({
      ...formData,
      meetingDate: startDateTime.toISOString(),
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      participants,
    }, {
      onSuccess: () => {
        onRefresh?.();
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-base font-bold text-slate-100">Schedule New Meeting</span>
            <span className="block text-xs font-normal text-slate-400">Invite clients, employees, and team members</span>
          </div>
        </div>
      }
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Meeting Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Q3 Audit Review & Tax Filing Sync"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Type & Mode Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Meeting Type</label>
              <select
                value={formData.meetingType}
                onChange={(e) => setFormData({ ...formData, meetingType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="CLIENT">Client Meeting</option>
                <option value="INTERNAL">Internal Team Sync</option>
                <option value="AUDIT_REVIEW">Audit Review</option>
                <option value="TASK_DISCUSSION">Task Discussion</option>
                <option value="TRAINING">Training / Onboarding</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Meeting Mode</label>
              <select
                value={formData.meetingMode}
                onChange={(e) => setFormData({ ...formData, meetingMode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="IN_APP_VIDEO">🌐 In-App Video Call (WebRTC)</option>
                <option value="GOOGLE_MEET">Google Meet</option>
                <option value="ZOOM">Zoom</option>
                <option value="IN_PERSON">🏢 In-Person Office</option>
                <option value="PHONE_CALL">📞 Phone Call</option>
              </select>
            </div>
          </div>

          {/* Dynamic Link Input Box for Google Meet / Zoom / In-Person */}
          {formData.meetingMode === 'GOOGLE_MEET' && (
            <div>
              <label className="block text-xs font-semibold text-indigo-300 mb-1.5">Google Meet URL *</label>
              <input
                type="text"
                required
                placeholder="https://meet.google.com/abc-defg-hij"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-indigo-500/50 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {formData.meetingMode === 'ZOOM' && (
            <div>
              <label className="block text-xs font-semibold text-indigo-300 mb-1.5">Zoom Meeting URL *</label>
              <input
                type="text"
                required
                placeholder="https://zoom.us/j/1234567890"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-indigo-500/50 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {formData.meetingMode === 'IN_PERSON' && (
            <div>
              <label className="block text-xs font-semibold text-indigo-300 mb-1.5">Office Location / Address *</label>
              <input
                type="text"
                required
                placeholder="e.g. Conference Room A, 3rd Floor, Auditee House"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-indigo-500/50 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Date, Start Time, End Time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date *</label>
              <input
                type="date"
                required
                value={formData.meetingDate}
                onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Time (Optional)</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">End Time (Optional)</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Agenda */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Agenda / Discussion Topics</label>
            <textarea
              rows={2}
              placeholder="e.g. Review GST filing discrepancies and finalize Annual Return"
              value={formData.agenda}
              onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Invite Option Choice */}
          <div className="p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-100">Invite All Users & Clients of Firm</p>
                <p className="text-[10px] text-slate-400">Sends meeting invitation to all firm employees and clients automatically</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.inviteAll}
              onChange={(e) => setFormData({ ...formData, inviteAll: e.target.checked })}
              className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Participant Emails */}
          {!formData.inviteAll && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Invite Participant Emails (Comma Separated)</label>
              <input
                type="text"
                placeholder="client@company.com, employee@auditee.com"
                value={formData.participantEmail}
                onChange={(e) => setFormData({ ...formData, participantEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={scheduleMeetingMutation.isPending}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{scheduleMeetingMutation.isPending ? 'Scheduling...' : 'Schedule Meeting'}</span>
            </button>
          </div>
        </form>
    </Modal>
  );
};

export default ScheduleMeetingModal;
