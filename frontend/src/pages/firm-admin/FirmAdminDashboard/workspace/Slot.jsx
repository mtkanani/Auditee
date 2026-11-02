import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button, Card } from '../../../../components/ui';
import { WidgetSkeleton } from './WidgetSkeleton';

/** Shows a widget once the workspace has loaded: a skeleton until then, a retry card if it failed. */
export const Slot = ({ ws, title, rows, className, children }) => {
  if (ws.data) return children(ws.data);
  if (ws.isError)
    return (
      <Card title={title} className={className}>
        <div className="flex items-center justify-between gap-3 py-2">
          <p className="text-sm text-muted">Couldn't load this right now.</p>
          <Button size="sm" icon={RefreshCw} onClick={() => ws.refetch()}>
            Try again
          </Button>
        </div>
      </Card>
    );
  return <WidgetSkeleton title={title} rows={rows} className={className} />;
};
