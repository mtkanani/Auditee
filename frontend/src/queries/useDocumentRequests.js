import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { documentRequestService } from '../services/documentRequestService';
import { dashboardKeys, documentRequestKeys } from './keys';

export const useDocumentRequests = (status = 'PENDING', options = {}) =>
  useQuery({
    queryKey: documentRequestKeys.list(status),
    queryFn: () => documentRequestService.list(status),
    ...options,
  });

const useRequestMutation = (mutationFn, success) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (res, vars) => {
      toast.success(typeof success === 'function' ? success(res, vars) : success);
      queryClient.invalidateQueries({ queryKey: documentRequestKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.firmWorkspace() });
    },
    onError: (err) => toast.error(err.message || 'Something went wrong'),
  });
};

export const useCreateDocumentRequest = () =>
  useRequestMutation((data) => documentRequestService.create(data), (res) => `Asked ${res?.data?.client?.companyName || res?.data?.client?.clientName || 'the client'} for it`);

export const useSetDocumentRequestStatus = () =>
  useRequestMutation(({ id, status }) => documentRequestService.setStatus(id, status), (res, vars) => (vars.status === 'RECEIVED' ? 'Marked as received' : 'Request cancelled'));

export const useRemindDocumentRequest = () => useRequestMutation((id) => documentRequestService.remind(id), 'Reminder sent to the client');
