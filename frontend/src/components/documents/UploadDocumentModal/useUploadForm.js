import { useState } from 'react';
import toast from 'react-hot-toast';
import { useUploadDocument } from '../../../queries/useDocuments';

const EMPTY_FORM = {
  title: '',
  fileName: '',
  fileUrl: '',
  fileSize: 0,
  mimeType: 'application/pdf',
  category: 'GENERAL',
  clientId: '',
  taskId: '',
  isConfidential: false,
  notes: '',
};

export const useUploadForm = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const uploadMutation = useUploadDocument();

  const setField = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleFileChange = (file) => {
    if (!file) return;
    // In a real system this would upload to S3/Cloudinary. We'll simulate with a fake URL.
    const fakeUrl = `https://auditee-vault.s3.amazonaws.com/${Date.now()}_${file.name}`;
    setForm((prev) => ({
      ...prev,
      fileName: file.name,
      fileUrl: fakeUrl,
      fileSize: file.size,
      mimeType: file.type || 'application/octet-stream',
      title: prev.title || file.name.replace(/\.[^.]+$/, ''),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.fileUrl || !form.fileName) {
      toast.error('Please fill in all required fields and select a file.');
      return;
    }
    uploadMutation.mutate({
      ...form,
      clientId: form.clientId ? parseInt(form.clientId, 10) : null,
      taskId: form.taskId ? parseInt(form.taskId, 10) : null,
    }, {
      onSuccess: () => {
        setForm(EMPTY_FORM);
        onSuccess?.();
        onClose();
      },
    });
  };

  return { form, setForm, setField, handleFileChange, handleSubmit, uploadMutation };
};
