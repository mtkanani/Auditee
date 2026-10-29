import React, { useState } from 'react';
import { CheckCheck, ChevronDown, Megaphone, Plus, Trash2, Users } from 'lucide-react';
import { CreateNoticeModal } from '../../components/announcements/CreateNoticeModal';
import { NoticeCard } from '../../components/announcements/NoticeCard';
import { useAdminAnnouncements, useCreateNotice, useDeleteNotice } from '../../queries/useAnnouncements';
import { useConfirm } from '../../components/common/ConfirmProvider';
import { CardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Avatar } from '../../components/common/Avatar';
import { Button, PageHeader } from '../../components/ui';
import { cn } from '../../lib/cn';

/** Who has acknowledged a notice: progress bar plus an expandable list. */
const Receipts = ({ notice, expanded, onToggle }) => {
  const metrics = notice.metrics || {};
  const percent = metrics.acknowledgedPercentage || 0;
  const reads = notice.reads || [];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-1.5 text-muted">
          <Users className="w-4 h-4" aria-hidden="true" /> Acknowledged
        </span>
        <span className="font-medium text-fg tabular-nums">
          {metrics.acknowledgedCount ?? 0} of {metrics.totalUsers ?? 0} staff <span className="text-subtle font-normal">({percent}%)</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-hover overflow-hidden" role="progressbar" aria-label="Staff acknowledged" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full bg-success transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="inline-flex items-center gap-1 text-sm font-medium text-accent-fg hover:underline underline-offset-4"
      >
        {expanded ? 'Hide who acknowledged' : 'See who acknowledged'}
        <ChevronDown className={cn('w-4 h-4 transition-transform', expanded && 'rotate-180')} aria-hidden="true" />
      </button>
      {expanded &&
        (reads.length === 0 ? (
          <p className="text-sm text-muted">No one has acknowledged this notice yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-y-auto">
            {reads.map((r) => (
              <li key={r.id} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2">
                <Avatar firstName={r.user?.firstName} lastName={r.user?.lastName} size="sm" className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-fg truncate">{r.user ? `${r.user.firstName} ${r.user.lastName}` : `User #${r.userId}`}</p>
                  <p className="text-xs text-subtle truncate">{r.user?.email}</p>
                </div>
                <CheckCheck className="w-4 h-4 text-success shrink-0" aria-label="Acknowledged" />
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
};

export const FirmAnnouncements = () => {
  const confirm = useConfirm();
  const { notices, isLoading } = useAdminAnnouncements();
  const createNoticeMutation = useCreateNotice();
  const deleteNoticeMutation = useDeleteNotice();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedNoticeId, setExpandedNoticeId] = useState(null);

  const handleCreateNotice = async (noticeData) => {
    await createNoticeMutation.mutateAsync(noticeData);
  };

  const handleDeleteNotice = async (id) => {
    const ok = await confirm({
      title: 'Delete Notice',
      message: 'Are you sure you want to delete this notice broadcast?',
      confirmText: 'Delete',
      isDanger: true,
    });
    if (!ok) return;
    deleteNoticeMutation.mutate(id);
  };

  const newButton = (
    <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
      New notice
    </Button>
  );

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Notices"
        description="Share policies, deadlines and instructions with your whole firm, and see who has read them."
        actions={newButton}
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface">
          <EmptyState icon={Megaphone} title="No notices yet" description="Post the first notice and every staff member will see it on their dashboard." action={newButton} />
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              actions={
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Delete ${notice.title}`}
                  title="Delete notice"
                  disabled={deleteNoticeMutation.isPending}
                  onClick={() => handleDeleteNotice(notice.id)}
                  className="text-danger hover:bg-danger-soft"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              }
              footer={
                <Receipts
                  notice={notice}
                  expanded={expandedNoticeId === notice.id}
                  onToggle={() => setExpandedNoticeId(expandedNoticeId === notice.id ? null : notice.id)}
                />
              }
            />
          ))}
        </div>
      )}

      <CreateNoticeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleCreateNotice} />
    </div>
  );
};
