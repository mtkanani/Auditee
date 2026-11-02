import React from 'react';
import { MessageSquare, Paperclip, Send } from 'lucide-react';
import { Avatar } from '../../common/Avatar';
import { Button, Field, Input, Textarea } from '../../ui';

const when = (d) => new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
const roleLabel = (r = '') => r.toLowerCase().replace(/_/g, ' ');

export const CommentsTab = ({ task, handleAddComment, commentText, setCommentText, commentFileUrl, setCommentFileUrl }) => {
  const comments = task?.comments || [];
  return (
    <div className="space-y-5">
      {comments.length > 0 ? (
        <ol className="space-y-3">
          {comments.map((c) => {
            const [first = '', last = ''] = (c.commenterName || '').split(' ');
            return (
              <li key={c.id} className="flex gap-3">
                <Avatar firstName={first} lastName={last} size="sm" className="shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0 rounded-2xl rounded-tl-md border border-line bg-surface px-4 py-3 space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <span className="text-sm font-medium text-fg">
                      {c.commenterName} <span className="text-xs font-normal text-subtle capitalize">· {roleLabel(c.commenterRole)}</span>
                    </span>
                    <span className="text-xs text-subtle tabular-nums">{when(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-muted whitespace-pre-line">{c.comment}</p>
                  {c.fileUrl && (
                    <a href={c.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-accent-fg hover:underline">
                      <Paperclip className="w-3.5 h-3.5" aria-hidden="true" /> Attached file
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="flex flex-col items-center py-10 text-center rounded-2xl border border-dashed border-line">
          <MessageSquare className="w-5 h-5 text-subtle mb-2" aria-hidden="true" />
          <p className="text-sm text-muted">No comments yet. Ask a question or leave a note below.</p>
        </div>
      )}

      <form onSubmit={handleAddComment} className="space-y-3 pt-4 border-t border-line">
        <Field label="Add a comment">
          {(p) => <Textarea {...p} required rows={2} placeholder="Write a comment or note" value={commentText} onChange={(e) => setCommentText(e.target.value)} />}
        </Field>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              aria-label="File link (optional)"
              icon={Paperclip}
              placeholder="File link (optional)"
              value={commentFileUrl}
              onChange={(e) => setCommentFileUrl(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" icon={Send}>Post</Button>
        </div>
      </form>
    </div>
  );
};
