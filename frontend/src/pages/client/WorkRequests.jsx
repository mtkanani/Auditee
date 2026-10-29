import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button, Card, Field, Input, PageHeader, Select, Textarea } from '../../components/ui';
import { DropZone } from '../../components/documents/UploadDocumentModal/DropZone';
import { useClientCreateTask } from '../../queries/useTasks';
import { useUploadTaskAttachment } from '../../queries/useAttachments';

const MAX_MB = 25;

const PRIORITIES = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

export const WorkRequests = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const clientCreateTaskMutation = useClientCreateTask();
  const uploadAttachment = useUploadTaskAttachment();
  const isSending = clientCreateTaskMutation.isPending || uploadAttachment.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { priority: 'LOW' } });

  const pickFile = (file) => {
    if (!file) return;
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Files can be up to ${MAX_MB} MB`);
      return;
    }
    setSelectedFile(file);
  };

  const done = () => {
    reset();
    setSelectedFile(null);
    setProgress(0);
    navigate('/client/tasks');
  };

  // Create the request first, then upload the file onto the new task.
  const onSubmit = async (data) => {
    const payload = { ...data, dueDate: data.dueDate ? data.dueDate : undefined };
    let created;
    try {
      created = await clientCreateTaskMutation.mutateAsync(payload);
    } catch {
      return; // toast shown by the hook
    }
    const taskId = created?.data?.id;
    if (!selectedFile || !taskId) return done();
    try {
      await uploadAttachment.mutateAsync({ taskId, file: selectedFile, onProgress: setProgress, silent: true });
    } catch {
      toast.error('Your request was sent, but the file did not upload. Open the request to attach it again.');
    }
    done();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader title="New request" description="Ask your CA firm for GST, TDS, income tax, audit or any other work." />

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Field label="What do you need?" required error={errors.title?.message}>
            {(p) => (
              <Input
                {...p}
                placeholder="e.g. GST return filing for Q2"
                {...register('title', { required: 'Add a short title' })}
              />
            )}
          </Field>

          <Field label="Details" required error={errors.description?.message}>
            {(p) => (
              <Textarea
                {...p}
                rows={4}
                placeholder="Invoice numbers, periods, notices received, anything your team should know"
                {...register('description', { required: 'Add a few details' })}
              />
            )}
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Priority">{(p) => <Select {...p} options={PRIORITIES} {...register('priority')} />}</Field>
            <Field label="Needed by" hint="Optional">
              {(p) => <Input {...p} type="date" {...register('dueDate')} />}
            </Field>
          </div>

          <Field label="Attachment" hint="Optional. Invoices, statements or notices.">
            {() => <DropZone fileName={selectedFile?.name} fileSize={selectedFile?.size} onFile={pickFile} disabled={isSending} />}
          </Field>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={Send}
            loading={isSending}
            className="w-full"
          >
            {uploadAttachment.isPending ? `Uploading… ${progress}%` : clientCreateTaskMutation.isPending ? 'Sending…' : 'Send request'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
