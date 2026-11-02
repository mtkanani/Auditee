import React from 'react';
import { CircleCheckBig, Megaphone } from 'lucide-react';
import { useUserAnnouncements, useAcknowledgeNotice } from '../../queries/useAnnouncements';
import { CardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { NoticeCard } from '../../components/announcements/NoticeCard';
import { shortDate } from '../../components/announcements/noticeStyle';
import { Badge, Button, PageHeader } from '../../components/ui';

export const UserAnnouncements = () => {
  const { notices, isLoading } = useUserAnnouncements();
  const acknowledgeNoticeMutation = useAcknowledgeNotice();

  const handleAcknowledge = (id) => {
    acknowledgeNoticeMutation.mutate(id);
  };

  return (
    <div className="space-y-6 pb-8">
      <PageHeader title="Notices" description="Policies, deadlines and instructions from your firm. Mark each one as read once you've gone through it." />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface">
          <EmptyState icon={Megaphone} title="No notices yet" description="When your firm posts a notice, it will show up here." />
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              highlight={!notice.isAcknowledged}
              footer={
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-subtle">From your firm admin</span>
                  {notice.isAcknowledged ? (
                    <Badge tone="success" className="h-8 px-3">
                      <CircleCheckBig className="w-4 h-4" aria-hidden="true" />
                      Read{notice.acknowledgedAt ? ` on ${shortDate(notice.acknowledgedAt)}` : ''}
                    </Badge>
                  ) : (
                    <Button
                      variant="primary"
                      icon={CircleCheckBig}
                      loading={acknowledgeNoticeMutation.isPending && acknowledgeNoticeMutation.variables === notice.id}
                      disabled={acknowledgeNoticeMutation.isPending}
                      onClick={() => handleAcknowledge(notice.id)}
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};
