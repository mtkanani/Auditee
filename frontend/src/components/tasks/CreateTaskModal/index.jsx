import React from 'react';
import { ClipboardPlus } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { Button, Field, Input, Select, Textarea } from '../../ui';
import { useCreateTaskForm } from './useCreateTaskForm';
import { AssigneePicker } from './AssigneePicker';
import { ChecklistBuilder } from './ChecklistBuilder';

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

export const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const form = useCreateTaskForm({ isOpen, onClose, onTaskCreated });
  const { clients, title, setTitle, description, setDescription, clientId, setClientId, priority, setPriority, dueDate, setDueDate, handleSubmit, createTaskMutation } = form;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New task" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Title" required>
          {(p) => <Input {...p} required placeholder="e.g. Monthly GSTR-3B filing" value={title} onChange={(e) => setTitle(e.target.value)} />}
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Client" className="sm:col-span-2">
            {(p) => (
              <Select {...p} value={clientId} onChange={(e) => setClientId(e.target.value)}>
                <option value="">Internal task (no client)</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName || c.clientName} ({c.gstNumber || 'N/A'})
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Priority">
            {(p) => <Select {...p} value={priority} onChange={(e) => setPriority(e.target.value)} options={PRIORITY_OPTIONS} />}
          </Field>
        </div>

        <AssigneePicker {...form} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Due date">
            {(p) => <Input {...p} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />}
          </Field>
          <Field label="Instructions" className="sm:col-span-2">
            {(p) => <Textarea {...p} rows={1} placeholder="Short instructions for whoever picks this up" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-10" />}
          </Field>
        </div>

        <ChecklistBuilder {...form} />

        <div className="pt-4 border-t border-line flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" icon={ClipboardPlus} loading={createTaskMutation.isPending}>
            Create task
          </Button>
        </div>
      </form>
    </Modal>
  );
};
