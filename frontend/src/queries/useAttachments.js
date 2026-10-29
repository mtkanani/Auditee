import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { storeFile } from '../services/documentService';
import { taskService } from '../services/taskService';
import { firmAdminService } from '../services/firmAdminService';
import { taskKeys, clientKeys } from './keys';

const errorMessage = (err, fallback) => err?.response?.data?.message || err?.message || fallback;

/** Upload a file to storage and attach it to a task (works for firm admin, employee and client). */
export const useUploadTaskAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, file, onProgress }) => {
      const { storageKey } = await storeFile(file, 'tasks', onProgress);
      return taskService.addDocument(taskId, { fileName: file.name, storageKey });
    },
    onSuccess: (data, { taskId, silent }) => {
      if (!silent) toast.success('File attached');
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    },
    // silent: the caller shows its own messages
    onError: (err, { silent }) => {
      if (!silent) toast.error(errorMessage(err, 'Upload failed. Please try again.'));
    },
  });
};

/**
 * Opens an attachment. Stored files get a fresh short-lived link from the API (which checks access);
 * the link is attachment-only, so the page downloads it without navigating away. Pasted links open in a new tab.
 */
const useOpenAttachment = (fetchLink) =>
  useMutation({
    mutationFn: async (args) => {
      if (!args.doc.storageKey) return { url: args.doc.fileUrl, external: true };
      const res = await fetchLink(args);
      return res.data;
    },
    onSuccess: ({ url, external }) => {
      if (!url) return;
      if (external) window.open(url, '_blank', 'noopener,noreferrer');
      else window.location.assign(url);
    },
    onError: (err) => toast.error(errorMessage(err, 'Could not open this file.')),
  });

export const useOpenTaskAttachment = () => useOpenAttachment(({ taskId, doc }) => taskService.getDocumentDownload(taskId, doc.id));

export const useOpenClientDocument = () =>
  useOpenAttachment(({ clientId, doc }) => firmAdminService.getClientDocumentDownload(clientId, doc.id));

/** Upload a client master document to storage, then save it. */
export const useUploadClientDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ clientId, file, details, onProgress }) => {
      const { storageKey } = await storeFile(file, 'clients', onProgress);
      return firmAdminService.addClientDocument(clientId, { ...details, storageKey });
    },
    onSuccess: (data, { clientId }) => {
      toast.success('Document uploaded');
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(clientId) });
    },
    onError: (err) => toast.error(errorMessage(err, 'Upload failed. Please try again.')),
  });
};
