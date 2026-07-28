import React, { useState } from 'react';
import { X, Calendar, Clock, Video, Users, MapPin, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { meetingApi } from '../../api/meetingApi';

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

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a meeting title.');
      return;
    }

    setLoading(true);

    try {
      const startDateTime = new Date(`${formData.meetingDate}T${formData.startTime}:00`);
      const endDateTime = new Date(`${formData.meetingDate}T${formData.endTime}:00`);

      const participants = formData.participantEmail
        ? formData.participantEmail.split(',').map((email) => ({ email: email.trim() }))
        : [];

      await meetingApi.schedule({
        ...formData,
        meetingDate: startDateTime.toISOString(),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        participants,
      });

      toast.success('Meeting scheduled successfully!');
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to schedule meeting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Schedule New Meeting</h3>
              <p className="text-xs text-slate-400">Invite clients, employees, and team members</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date</label>
              <input
                type="date"
                required
                value={formData.meetingDate}
                onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Time</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">End Time</label>
              <input
                type="time"
                required
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

          {/* Participant Emails */}
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
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{loading ? 'Scheduling...' : 'Schedule Meeting'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleMeetingModal;
