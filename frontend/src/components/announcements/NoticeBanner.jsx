import React, { useState, useMemo } from 'react';
import { CircleCheckBig } from 'lucide-react';
import { useUserAnnouncements, useAcknowledgeNotice } from '../../queries/useAnnouncements';
import { Badge, Button } from '../ui';
import { cn } from '../../lib/cn';
import { categoryLabel, priorityStyle, shortDate } from './noticeStyle';

const BANNER = {
  URGENT: 'border-danger/30 bg-danger-soft',
  WARNING: 'border-warning/30 bg-warning-soft',
  INFO: 'border-accent/25 bg-accent-soft/60',
};

/** Dashboard banner for the oldest unread notice, with "Mark as read" and a count of the rest. */
export const NoticeBanner = () => {
  const { notices: allNotices = [] } = useUserAnnouncements();
  const acknowledgeNoticeMutation = useAcknowledgeNotice();
  const [dismissedIds, setDismissedIds] = useState([]);

  const unackNotices = useMemo(
    () => allNotices.filter((n) => !n.isAcknowledged),
    [allNotices]
  );
  const activeNotices = useMemo(
    () => unackNotices.filter((n) => !dismissedIds.includes(n.id)),
    [unackNotices, dismissedIds]
  );

  const handleAcknowledge = (id) => {
    acknowledgeNoticeMutation.mutate(id, {
      onSuccess: () => {
        setDismissedIds((prev) => [...prev, id]);
      },
    });
  };

  if (activeNotices.length === 0) return null;

  const currentNotice = activeNotices[0];
  const p = priorityStyle(currentNotice.priority);
  const Icon = p.icon;

  return (
    <section
      aria-label="Unread notice"
      className={cn('p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4', BANNER[currentNotice.priority] || BANNER.INFO)}
    >
      <div className="flex items-start gap-3 min-w-0">
        <span className={cn('grid place-items-center w-9 h-9 rounded-xl bg-surface shrink-0', p.text)}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={p.tone}>{categoryLabel(currentNotice.category)}</Badge>
            <span className="text-xs text-muted">{shortDate(currentNotice.createdAt)}</span>
          </div>
          <h4 className="text-sm font-semibold text-fg mt-1">{currentNotice.title}</h4>
          <p className="text-sm text-muted mt-0.5 line-clamp-2">{currentNotice.content}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
        {activeNotices.length > 1 && <span className="text-xs font-medium text-muted">+{activeNotices.length - 1} more</span>}
        <Button variant="primary" icon={CircleCheckBig} loading={acknowledgeNoticeMutation.isPending} onClick={() => handleAcknowledge(currentNotice.id)}>
          Mark as read
        </Button>
      </div>
    </section>
  );
};
