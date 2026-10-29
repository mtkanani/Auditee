import React, { useState } from 'react';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../common/Modal';
import { Button, Field, Input, Select, Textarea } from '../ui';

const CATEGORY_OPTIONS = [
  { value: 'COMPLIANCE', label: 'Compliance' },
  { value: 'POLICY', label: 'Policy' },
  { value: 'DEADLINE', label: 'Deadline' },
  { value: 'GENERAL', label: 'General' },
];

const PRIORITY_OPTIONS = [
  { value: 'INFO', label: 'Info' },
  { value: 'WARNING', label: 'Important' },
  { value: 'URGENT', label: 'Urgent (shown as a banner)' },
];

export const CreateNoticeModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'COMPLIANCE',
    priority: 'INFO',
    expiresAt: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSuccess({
        title: form.title.trim(),
        content: form.content.trim(),
        category: form.category,
        priority: form.priority,
        expiresAt: form.expiresAt || null,
      });
      onClose();
      setForm({
        title: '',
        content: '',
        category: 'COMPLIANCE',
        priority: 'INFO',
        expiresAt: '',
      });
    } catch {
      // Handled in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New notice" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Title" required>
          {(p) => <Input {...p} required placeholder="e.g. GSTR-3B reconciliation checklist" value={form.title} onChange={set('title')} />}
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Category">
            {(p) => <Select {...p} value={form.category} onChange={set('category')} options={CATEGORY_OPTIONS} />}
          </Field>
          <Field label="Priority">
            {(p) => <Select {...p} value={form.priority} onChange={set('priority')} options={PRIORITY_OPTIONS} />}
          </Field>
        </div>

        <Field label="Expires on" hint="Optional">
          {(p) => <Input {...p} type="date" value={form.expiresAt} onChange={set('expiresAt')} />}
        </Field>

        <Field label="Message" required>
          {(p) => <Textarea {...p} rows={5} required placeholder="What everyone needs to know or do" value={form.content} onChange={set('content')} />}
        </Field>

        <div className="pt-4 border-t border-line flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" icon={Send} loading={isSubmitting}>Post notice</Button>
        </div>
      </form>
    </Modal>
  );
};
