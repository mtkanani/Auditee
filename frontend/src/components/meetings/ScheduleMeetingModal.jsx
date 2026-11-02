import React, { useState } from 'react';
import { CalendarPlus, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../common/Modal';
import { Button, Field, Input, Select, Textarea } from '../ui';
import { cn } from '../../lib/cn';
import { useScheduleMeeting } from '../../queries/useMeetings';

const TYPE_OPTIONS = [
  { value: 'CLIENT', label: 'Client meeting' },
  { value: 'INTERNAL', label: 'Internal team sync' },
  { value: 'AUDIT_REVIEW', label: 'Audit review' },
  { value: 'TASK_DISCUSSION', label: 'Task discussion' },
  { value: 'TRAINING', label: 'Training or onboarding' },
  { value: 'EMERGENCY', label: 'Emergency' },
];

const MODE_OPTIONS = [
  { value: 'IN_APP_VIDEO', label: 'In-app video call' },
  { value: 'GOOGLE_MEET', label: 'Google Meet' },
  { value: 'ZOOM', label: 'Zoom' },
  { value: 'IN_PERSON', label: 'In person at the office' },
  { value: 'PHONE_CALL', label: 'Phone call' },
];

// The extra field each mode needs, if any.
const MODE_FIELD = {
  GOOGLE_MEET: { key: 'meetingLink', label: 'Google Meet link', placeholder: 'https://meet.google.com/abc-defg-hij' },
  ZOOM: { key: 'meetingLink', label: 'Zoom link', placeholder: 'https://zoom.us/j/1234567890' },
  IN_PERSON: { key: 'location', label: 'Office location', placeholder: 'e.g. Conference room A, 3rd floor' },
};

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
    inviteAll: false,
  });

  const scheduleMeetingMutation = useScheduleMeeting();

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

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

  const modeField = MODE_FIELD[formData.meetingMode];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule a meeting" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Title" required>
          {(p) => <Input {...p} required placeholder="e.g. Q3 audit review and tax filing sync" value={formData.title} onChange={set('title')} />}
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Type">
            {(p) => <Select {...p} value={formData.meetingType} onChange={set('meetingType')} options={TYPE_OPTIONS} />}
          </Field>
          <Field label="How">
            {(p) => <Select {...p} value={formData.meetingMode} onChange={set('meetingMode')} options={MODE_OPTIONS} />}
          </Field>
        </div>

        {modeField && (
          <Field key={formData.meetingMode} label={modeField.label} required>
            {(p) => <Input {...p} required placeholder={modeField.placeholder} value={formData[modeField.key]} onChange={set(modeField.key)} />}
          </Field>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Date" required>
            {(p) => <Input {...p} type="date" required value={formData.meetingDate} onChange={set('meetingDate')} />}
          </Field>
          <Field label="Starts" hint="Optional">
            {(p) => <Input {...p} type="time" value={formData.startTime} onChange={set('startTime')} />}
          </Field>
          <Field label="Ends" hint="Optional">
            {(p) => <Input {...p} type="time" value={formData.endTime} onChange={set('endTime')} />}
          </Field>
        </div>

        <Field label="Agenda">
          {(p) => <Textarea {...p} rows={2} placeholder="e.g. Review GST filing differences and finalise the annual return" value={formData.agenda} onChange={set('agenda')} />}
        </Field>

        <label
          className={cn(
            'flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors',
            formData.inviteAll ? 'border-accent bg-accent-soft/50' : 'border-line hover:border-line-strong'
          )}
        >
          <Users className={cn('w-4 h-4 mt-0.5 shrink-0', formData.inviteAll ? 'text-accent-fg' : 'text-subtle')} aria-hidden="true" />
          <span className="flex-1">
            <span className="block text-sm font-medium text-fg">Invite everyone at the firm</span>
            <span className="block text-xs text-muted">Sends the invitation to all firm employees and clients automatically</span>
          </span>
          <input
            type="checkbox"
            className="mt-0.5 w-4 h-4 rounded accent-[var(--accent)]"
            checked={formData.inviteAll}
            onChange={(e) => setFormData({ ...formData, inviteAll: e.target.checked })}
          />
        </label>

        {!formData.inviteAll && (
          <Field label="Invite by email" hint="Separate addresses with commas">
            {(p) => <Input {...p} placeholder="client@company.com, employee@auditee.com" value={formData.participantEmail} onChange={set('participantEmail')} />}
          </Field>
        )}

        <div className="pt-4 border-t border-line flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" icon={CalendarPlus} loading={scheduleMeetingMutation.isPending}>
            Schedule meeting
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ScheduleMeetingModal;
