import { MapPin, Phone, Video } from 'lucide-react';

export const TYPE_OPTIONS = [
  { value: 'CLIENT', label: 'Client meeting' },
  { value: 'INTERNAL', label: 'Internal' },
  { value: 'AUDIT_REVIEW', label: 'Audit review' },
  { value: 'TASK_DISCUSSION', label: 'Task discussion' },
  { value: 'TRAINING', label: 'Training' },
  { value: 'EMERGENCY', label: 'Emergency' },
];

export const STATUS_OPTIONS = [
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const MODES = {
  IN_APP_VIDEO: { label: 'In-app video call', icon: Video },
  GOOGLE_MEET: { label: 'Google Meet', icon: Video },
  ZOOM: { label: 'Zoom', icon: Video },
  IN_PERSON: { label: 'In person', icon: MapPin },
  PHONE_CALL: { label: 'Phone call', icon: Phone },
};

const humanize = (s = '') => s.toLowerCase().replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export const typeLabel = (type) => TYPE_OPTIONS.find((t) => t.value === type)?.label || humanize(type);

export const modeInfo = (mode) => MODES[mode] || { label: humanize(mode), icon: Video };

/** 'live' | 'scheduled' | 'completed' | 'cancelled' — live means in progress, or now within its time slot. */
export const meetingState = (meeting) => {
  const status = (meeting.status || '').toUpperCase();
  if (status === 'COMPLETED') return 'completed';
  if (status === 'CANCELLED') return 'cancelled';
  const now = new Date();
  if (status === 'IN_PROGRESS' || (new Date(meeting.startTime) <= now && new Date(meeting.endTime) >= now)) return 'live';
  return 'scheduled';
};

const time = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

/** "Tue, 3 Nov · 10:00 am – 11:00 am" */
export const whenLabel = (meeting) => {
  const day = new Date(meeting.meetingDate || meeting.startTime).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  if (!meeting.startTime) return day;
  return `${day} · ${time(meeting.startTime)}${meeting.endTime ? ` – ${time(meeting.endTime)}` : ''}`;
};
