import { useState } from 'react';
import toast from 'react-hot-toast';
import { useUploadDocument } from '../../../queries/useDocuments';

// Mirrors the API's allow-list so people find out before uploading, not after.
export const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'jpg', 'jpeg', 'png', 'zip'];
export const MAX_FILE_BYTES = 25 * 1024 * 1024;

const EMPTY_FORM = {
  title: '',
  category: 'GENERAL',
  clientId: '',
  taskId: '',
  isConfidential: false,
  notes: '',
};

const extensionOf = (name = '') => (name.includes('.') ? name.split('.').pop().toLowerCase() : '');

export const useUploadForm = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const uploadMutation = useUploadDocument();

  const setField = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleFileChange = (picked) => {
    if (!picked) return;
    if (!ALLOWED_EXTENSIONS.includes(extensionOf(picked.name))) {
      toast.error('That file type is not allowed. Use PDF, Word, Excel, CSV, JPG, PNG or ZIP.');
      return;
    }
    if (picked.size > MAX_FILE_BYTES) {
      toast.error('Files can be at most 25 MB.');
      return;
    }
    setFile(picked);
    setForm((prev) => ({ ...prev, title: prev.title || picked.name.replace(/\.[^.]+$/, '') }));
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setFile(null);
    setProgress(0);
  };

  const handleClose = () => {
    if (uploadMutation.isPending) return; // don't abandon an upload half-way
    reset();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !file) {
      toast.error('Please fill in all required fields and select a file.');
      return;
    }
    setProgress(0);
    uploadMutation.mutate(
      {
        file,
        onProgress: setProgress,
        details: {
          ...form,
          clientId: form.clientId ? parseInt(form.clientId, 10) : null,
          taskId: form.taskId ? parseInt(form.taskId, 10) : null,
        },
      },
      {
        onSuccess: () => {
          reset();
          onSuccess?.();
          onClose();
        },
      }
    );
  };

  return { form, setForm, setField, file, progress, handleFileChange, handleSubmit, handleClose, uploadMutation };
};
