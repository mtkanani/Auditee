import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button, Input } from '../../ui';

export const ChecklistBuilder = ({ subtasks, subtaskInput, setSubtaskInput, handleAddSubtask, handleRemoveSubtask }) => (
  <fieldset className="space-y-2">
    <legend className="text-sm font-medium text-fg mb-1.5">
      Checklist <span className="text-subtle font-normal">(optional)</span>
    </legend>
    <div className="flex gap-2">
      <div className="flex-1">
        <Input
          aria-label="New checklist item"
          placeholder="e.g. Check the purchase register"
          value={subtaskInput}
          onChange={(e) => setSubtaskInput(e.target.value)}
          onKeyDown={(e) => {
            // Enter adds the item instead of submitting (and creating) the whole task.
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddSubtask();
            }
          }}
        />
      </div>
      <Button icon={Plus} onClick={handleAddSubtask}>Add</Button>
    </div>
    {subtasks.length > 0 && (
      <ol className="rounded-xl border border-line divide-y divide-line">
        {subtasks.map((st, i) => (
          <li key={i} className="flex items-center gap-3 pl-3 pr-1 h-10 text-sm">
            <span className="w-5 text-subtle tabular-nums">{i + 1}.</span>
            <span className="flex-1 text-fg truncate">{st}</span>
            <Button size="icon-sm" variant="ghost" aria-label={`Remove ${st}`} onClick={() => handleRemoveSubtask(i)}>
              <X className="w-4 h-4" />
            </Button>
          </li>
        ))}
      </ol>
    )}
  </fieldset>
);
