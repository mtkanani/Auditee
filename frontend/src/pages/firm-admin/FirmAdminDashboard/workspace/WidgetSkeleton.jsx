import React from 'react';
import { Card } from '../../../../components/ui';

/** Placeholder card while the workspace loads (fades in only if loading takes a moment). */
export const WidgetSkeleton = ({ title, rows = 4, className }) => (
  <Card title={title} className={className}>
    <div className="space-y-2.5" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-9 rounded-xl bg-hover animate-pulse" />
      ))}
    </div>
  </Card>
);
