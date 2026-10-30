import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Card } from '../ui';

/** Shortcut tiles. actions: [{ label, hint, icon, to, state? }] (links) or { ..., onClick } (buttons). */
export const QuickActions = ({ actions, title = 'Quick actions' }) => (
  <Card title={title}>
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {actions.map(({ label, hint, icon: Icon, to, state, onClick }) => {
        const inner = (
          <>
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-accent-soft text-accent-fg shrink-0 transition-transform group-hover:scale-105">
              <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-medium text-fg truncate">{label}</span>
              {hint && <span className="block text-xs text-subtle truncate">{hint}</span>}
            </span>
            <ArrowUpRight className="w-4 h-4 text-subtle opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          </>
        );
        const cls =
          'group w-full flex items-center gap-3 rounded-xl border border-line p-3 text-left hover:border-accent/40 hover:bg-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50';
        return (
          <li key={label}>
            {to ? (
              <Link to={to} state={state} className={cls}>{inner}</Link>
            ) : (
              <button type="button" onClick={onClick} className={cls}>{inner}</button>
            )}
          </li>
        );
      })}
    </ul>
  </Card>
);
