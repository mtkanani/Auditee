import React from 'react';
import { cn } from '../../lib/cn';

const tones = {
  neutral: 'bg-hover text-muted ring-line',
  accent: 'bg-accent-soft text-accent-fg ring-accent/20',
  success: 'bg-success-soft text-success ring-success/20',
  warning: 'bg-warning-soft text-warning ring-warning/20',
  danger: 'bg-danger-soft text-danger ring-danger/20',
};

const dots = {
  neutral: 'bg-subtle',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

/** Small status label. tone: neutral | accent | success | warning | danger. dot adds a leading status dot. */
export const Badge = ({ tone = 'neutral', dot = false, className, children }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-xs font-medium ring-1 ring-inset whitespace-nowrap',
      tones[tone],
      className
    )}
  >
    {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dots[tone])} aria-hidden="true" />}
    {children}
  </span>
);

// Maps the app's status strings to a tone, so pages can write <StatusTag status={task.status} />.
const statusTone = {
  ACTIVE: 'success', PAID: 'success', COMPLETED: 'success', FILED: 'success', APPROVED: 'success', WON: 'success',
  PENDING: 'warning', UPCOMING: 'warning', PARTIALLY_PAID: 'warning', UNDER_REVIEW: 'warning', IN_PROGRESS: 'accent',
  DISCUSSION: 'accent', PROPOSAL_SENT: 'accent', NEW_LEAD: 'neutral',
  OVERDUE: 'danger', REJECTED: 'danger', CANCELLED: 'danger', LOST: 'danger', SUSPENDED: 'danger', UNPAID: 'danger',
  INACTIVE: 'neutral', DRAFT: 'neutral',
};

const humanize = (s = '') => s.toLowerCase().replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

/** Badge for a status enum, e.g. IN_PROGRESS -> "In progress" in the accent tone. */
export const StatusTag = ({ status, className }) => (
  <Badge tone={statusTone[status] || 'neutral'} dot className={className}>
    {humanize(status)}
  </Badge>
);
