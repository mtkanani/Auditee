import React from 'react';
import { CalendarDays } from 'lucide-react';
import { Button, Field, Input, Textarea } from '../../ui';

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
    <form onSubmit={handleAddMeetingSubmit} className="rounded-2xl border border-line bg-surface p-5 space-y-4">
      <h4 className="text-sm font-semibold text-fg">Add meeting notes</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Agenda" required>
          {(p) => <Input {...p} required placeholder="e.g. Audit scope discussion" value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} />}
        </Field>
        <Field label="Attendees">
          {(p) => <Input {...p} placeholder="e.g. CA Rahul, client CFO" value={meetingAttendees} onChange={(e) => setMeetingAttendees(e.target.value)} />}
        </Field>
      </div>
      <Field label="Notes" required>
        {(p) => <Textarea {...p} required rows={3} placeholder="What was agreed, what they need next" value={meetingNotes} onChange={(e) => setMeetingNotes(e.target.value)} />}
      </Field>
      <div className="flex justify-end">
        <Button type="submit" variant="primary" loading={addMeetingNoteMutation.isPending}>Save notes</Button>
      </div>
    </form>

    {lead.meetingNotes?.length ? (
      <ol className="space-y-3">
        {lead.meetingNotes.map((m) => (
          <li key={m.id} className="rounded-xl border border-line bg-surface p-4 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-fg">{m.meetingTitle}</p>
              <span className="text-xs text-subtle tabular-nums">
                {new Date(m.meetingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <p className="text-sm text-muted whitespace-pre-line">{m.meetingNotes}</p>
            {m.attendees && <p className="text-xs text-subtle">With {m.attendees}</p>}
          </li>
        ))}
      </ol>
    ) : (
      <div className="flex flex-col items-center py-10 text-center rounded-2xl border border-dashed border-line">
        <CalendarDays className="w-5 h-5 text-subtle mb-2" aria-hidden="true" />
        <p className="text-sm text-muted">No meetings recorded yet.</p>
      </div>
    )}
  </div>
);
