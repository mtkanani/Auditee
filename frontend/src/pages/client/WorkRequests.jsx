import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button, Card, Field, Input, PageHeader, Select, Textarea } from '../../components/ui';
import { DropZone } from '../../components/documents/UploadDocumentModal/DropZone';
import { useClientCreateTask } from '../../queries/useTasks';

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
  const clientCreateTaskMutation = useClientCreateTask();

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

  const onSubmit = (data) => {
    const payload = {
      ...data,
      dueDate: data.dueDate ? data.dueDate : undefined,
      attachment: selectedFile ? selectedFile.name : undefined,
    };
    clientCreateTaskMutation.mutate(payload, {
      onSuccess: () => {
        reset();
        setSelectedFile(null);
        navigate('/client/tasks');
      },
    });
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
            {() => <DropZone fileName={selectedFile?.name} fileSize={selectedFile?.size} onFile={pickFile} />}
          </Field>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={Send}
            loading={clientCreateTaskMutation.isPending}
            className="w-full"
          >
            {clientCreateTaskMutation.isPending ? 'Sending…' : 'Send request'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
