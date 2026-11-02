import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Modal } from '../../../../components/common/Modal';
import { Button, Field, Input, Select, Textarea } from '../../../../components/ui';
import { useFirmClients } from '../../../../queries/useLookups';
import { useCreateDocumentRequest } from '../../../../queries/useDocumentRequests';

const EMPTY = { clientId: '', title: '', dueDate: '', notes: '' };

/** Ask a client for a document. They get a notification and an email, and it waits on the home page. */
export const RequestDocumentModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState(EMPTY);
  const { data: clients = [] } = useFirmClients({ limit: 100 }, { enabled: isOpen });
  const create = useCreateDocumentRequest();
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    create.mutate(
      { clientId: Number(form.clientId), title: form.title.trim(), dueDate: form.dueDate || null, notes: form.notes.trim() || null },
      {
        onSuccess: () => {
          setForm(EMPTY);
          onClose();
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request a document" maxWidth="max-w-lg">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Client" required>
          {(p) => (
            <Select {...p} required value={form.clientId} onChange={set('clientId')}>
              <option value="">Choose a client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName || c.clientName}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Document" required>
          {(p) => <Input {...p} required minLength={2} maxLength={200} placeholder="e.g. Bank statements for October" value={form.title} onChange={set('title')} />}
        </Field>
        <Field label="Needed by" hint="Optional">
          {(p) => <Input {...p} type="date" value={form.dueDate} onChange={set('dueDate')} />}
        </Field>
        <Field label="Note for the client" hint="Optional">
          {(p) => <Textarea {...p} rows={3} maxLength={1000} placeholder="Anything that helps them send the right file" value={form.notes} onChange={set('notes')} />}
        </Field>
        <div className="pt-4 border-t border-line flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={Send} loading={create.isPending}>
            Send request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
