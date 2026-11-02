import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { documentService } from '../services/documentService';
import { documentKeys, dashboardKeys } from './keys';
import toast from 'react-hot-toast';

// ----------------------------------------------------
// QUERIES
// ----------------------------------------------------

export const useVaultDocuments = (scope, filters = {}) => {
  const query = useQuery({
    queryKey: documentKeys.list(scope, filters),
    queryFn: async () => {
      let res;
      if (scope === 'firm') res = await documentService.getFirmVault(filters);
      else if (scope === 'client') res = await documentService.getClientVault(filters);
      else res = await documentService.getUserVault(filters);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  return {
    docs: query.data?.data || [],
    pagination: query.data?.pagination,
    summary: query.data?.summary,
    ...query,
  };
};

// ----------------------------------------------------
// MUTATIONS
// ----------------------------------------------------

/**
 * Uploads a file to storage, then saves the vault record.
 * mutate({ file, details, onProgress }): details are the form fields (title, category, clientId, ...).
 */
export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, details, onProgress }) => {
      const { data: signed } = await documentService.getUploadUrl({ fileName: file.name, fileSize: file.size });
      const { storageKey, uploadUrl, contentType } = signed.data;
      await documentService.putFile(uploadUrl, file, contentType, onProgress);
      return documentService.uploadDocument({ ...details, storageKey, fileName: file.name, fileSize: file.size, mimeType: contentType });
    },
    onSuccess: () => {
      toast.success('📁 Document uploaded to vault successfully!');
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Upload failed. Please try again.');
    },
  });
};

/**
 * Fetches a fresh download link and starts the download. The link is attachment-only, so
 * pointing the page at it downloads the file without leaving the app. Outside links open in a new tab.
 */
export const useDownloadDocument = () =>
  useMutation({
    mutationFn: async (doc) => {
      const { data } = await documentService.getDownloadUrl(doc.id);
      return data.data;
    },
    onSuccess: ({ url, external }) => {
      if (external) window.open(url, '_blank', 'noopener,noreferrer');
      else window.location.assign(url);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Could not download this file.');
    },
  });

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => documentService.deleteDocument(id),
    onSuccess: () => {
      toast.success('Document removed from vault');
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: () => {
      toast.error('Failed to delete document');
    },
  });
};
