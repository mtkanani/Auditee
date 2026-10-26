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
      return res.data?.data || res.data || [];
    },
    placeholderData: keepPreviousData,
  });

  return {
    docs: Array.isArray(query.data) ? query.data : [],
    ...query,
  };
};

// ----------------------------------------------------
// MUTATIONS
// ----------------------------------------------------

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => documentService.uploadDocument(data),
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
