import React from 'react';
import { Calendar } from 'lucide-react';

export const MeetingsTab = ({
  lead,
  handleAddMeetingSubmit,
  meetingTitle,
  setMeetingTitle,
  meetingAttendees,
  setMeetingAttendees,
  meetingNotes,
  setMeetingNotes,
  addMeetingNoteMutation,
}) => (
  <div className="space-y-4">
    <form onSubmit={handleAddMeetingSubmit} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
      <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
        <Calendar size="1em" className="text-purple-400"  /> Record Consultation Meeting Notes
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
        disabled={addMeetingNoteMutation.isPending}
        className="py-1.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg"
      >
        {addMeetingNoteMutation.isPending ? 'Saving Notes...' : 'Save Meeting Notes'}
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
);
