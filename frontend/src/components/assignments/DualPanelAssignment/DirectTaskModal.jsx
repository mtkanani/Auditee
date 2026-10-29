import React from 'react';
import { ClipboardPlus } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { Avatar } from '../../common/Avatar';
import { Button, Field, Input, Select, Textarea } from '../../ui';

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

export const DirectTaskModal = ({
  isTaskModalOpen,
  setIsTaskModalOpen,
  selectedUser,
  handleTaskSubmit,
  taskForm,
  setTaskForm,
  clients,
  isSubmittingTask,
}) => (
  <Modal isOpen={Boolean(isTaskModalOpen && selectedUser)} onClose={() => setIsTaskModalOpen(false)} title="Direct task" maxWidth="max-w-lg">
    {selectedUser && (
      <form onSubmit={handleTaskSubmit} className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-line bg-sunken/40 px-3 py-2.5">
          <Avatar firstName={selectedUser.firstName} lastName={selectedUser.lastName} size="sm" />
          <div className="min-w-0">
            <p className="text-xs text-subtle">For</p>
            <p className="text-sm font-medium text-fg truncate">
              {selectedUser.firstName} {selectedUser.lastName} <span className="font-normal text-subtle">· {selectedUser.email}</span>
            </p>
          </div>
        </div>

        <Field label="Client" hint="Optional">
          {(p) => (
            <Select {...p} value={taskForm.clientId} onChange={(e) => setTaskForm({ ...taskForm, clientId: e.target.value })}>
              <option value="">Internal task (no client)</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.clientName} ({c.companyName || c.email})
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field label="Title" required>
          {(p) => (
            <Input {...p} required placeholder="e.g. GST reconciliation for October" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
          )}
        </Field>

        <Field label="Instructions">
          {(p) => (
            <Textarea {...p} rows={3} placeholder="What needs doing, and anything they should know" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
          )}
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Priority">
            {(p) => <Select {...p} value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} options={PRIORITY_OPTIONS} />}
          </Field>
          <Field label="Due date">
            {(p) => <Input {...p} type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />}
          </Field>
        </div>

        <div className="pt-4 border-t border-line flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
          <Button type="submit" variant="primary" icon={ClipboardPlus} loading={isSubmittingTask}>Assign task</Button>
        </div>
      </form>
    )}
  </Modal>
);
