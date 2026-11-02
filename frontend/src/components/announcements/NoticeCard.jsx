import React from 'react';
import { Badge } from '../ui';
import { cn } from '../../lib/cn';
import { categoryLabel, priorityStyle, shortDate } from './noticeStyle';

/** One notice: priority icon, category and priority tags, title, date, body. footer: whatever the page adds below. */
export const NoticeCard = ({ notice, highlight = false, actions, footer }) => {
  const p = priorityStyle(notice.priority);
  const Icon = p.icon;
  return (
    <article className={cn('rounded-2xl border bg-surface shadow-card p-5 sm:p-6 space-y-4', highlight ? 'border-accent/40' : 'border-line')}>
      <header className="flex items-start gap-3">
        <span className={cn('grid place-items-center w-10 h-10 rounded-xl shrink-0', p.tile)}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{categoryLabel(notice.category)}</Badge>
            <Badge tone={p.tone} dot>{p.label}</Badge>
            <span className="text-xs text-subtle">{shortDate(notice.createdAt)}</span>
          </div>
          <h3 className="text-base font-semibold text-fg mt-1.5">{notice.title}</h3>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </header>

      <p className="text-sm text-muted whitespace-pre-line leading-relaxed">{notice.content}</p>

      {footer && <div className="pt-4 border-t border-line">{footer}</div>}
    </article>
  );
};
