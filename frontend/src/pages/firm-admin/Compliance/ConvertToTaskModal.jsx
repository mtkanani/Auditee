import React from 'react';
import { Zap } from 'lucide-react';
import { Modal } from '../../../components/common/Modal';
import { Badge, Button } from '../../../components/ui';
import { categoryLabel, shortDate } from './options';

/** Turns a filing into a task and assigns it to the chosen employees. */
export const ConvertToTaskModal = ({
  isTaskModalOpen,
  setIsTaskModalOpen,
  selectedItem,
  handleConvertToTaskSubmit,
  users,
  assignedUserIds,
  setAssignedUserIds,
  convertToTaskMutation,
}) => {
  const toggle = (id) =>
    setAssignedUserIds(assignedUserIds.includes(id) ? assignedUserIds.filter((x) => x !== id) : [...assignedUserIds, id]);

  return (
    <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title={`Make a task: ${selectedItem?.title || ''}`}>
      <form onSubmit={handleConvertToTaskSubmit} className="space-y-5">
        {selectedItem && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <Badge tone="accent">{categoryLabel(selectedItem.category)}</Badge>
            <span>Due {shortDate(selectedItem.dueDate)}</span>
          </div>
        )}

        <fieldset className="space-y-1.5">
          <legend className="text-sm font-medium text-fg mb-1.5">
            Assign to <span className="text-subtle font-normal">({assignedUserIds.length} selected)</span>
          </legend>
          <div className="max-h-56 overflow-y-auto rounded-xl border border-line divide-y divide-line">
            {users.length === 0 && <p className="px-3 py-4 text-sm text-muted">No employees found.</p>}
            {users.map((u) => (
              <label key={u.id} className="flex items-center gap-3 px-3 h-11 text-sm cursor-pointer hover:bg-hover">
                <input type="checkbox" className="w-4 h-4 rounded accent-[var(--accent)]" checked={assignedUserIds.includes(u.id)} onChange={() => toggle(u.id)} />
                <span className="flex-1 text-fg">{u.firstName} {u.lastName}</span>
                <span className="text-xs text-subtle">{u.designation || 'Staff'}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
          <Button type="submit" variant="primary" icon={Zap} loading={convertToTaskMutation.isPending}>Create task</Button>
        </div>
      </form>
    </Modal>
  );
};
