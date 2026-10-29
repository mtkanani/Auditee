import React from 'react';
import { ListChecks, Plus } from 'lucide-react';
import { Button, Input } from '../../ui';
import { cn } from '../../../lib/cn';

export const SubtasksTab = ({ handleAddSubtask, newSubtaskTitle, setNewSubtaskTitle, task, handleToggleSubtask }) => {
  const subtasks = task?.subtasks || [];
  return (
    <div className="space-y-5">
      <form onSubmit={handleAddSubtask} className="flex gap-2">
        <div className="flex-1">
          <Input
            aria-label="New checklist item"
            placeholder="Add an item, e.g. reconcile GSTR-2B input tax credit"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary" icon={Plus}>
          Add
        </Button>
      </form>

      {subtasks.length > 0 ? (
        <ul className="rounded-xl border border-line divide-y divide-line overflow-hidden">
          {subtasks.map((s) => (
            <li key={s.id}>
              <label className={cn('flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-hover', s.isCompleted && 'bg-sunken/40')}>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-[var(--success)] shrink-0"
                  checked={Boolean(s.isCompleted)}
                  onChange={() => handleToggleSubtask(s.id, s.isCompleted)}
                />
                <span className={cn('flex-1 text-sm', s.isCompleted ? 'line-through text-subtle' : 'text-fg')}>{s.title}</span>
                {s.completedAt && (
                  <span className="text-xs text-success whitespace-nowrap">
                    Done {new Date(s.completedAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                  </span>
                )}
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center py-10 text-center rounded-2xl border border-dashed border-line">
          <ListChecks className="w-5 h-5 text-subtle mb-2" aria-hidden="true" />
          <p className="text-sm text-muted">No checklist items yet. Add the first one above.</p>
        </div>
      )}
    </div>
  );
};
