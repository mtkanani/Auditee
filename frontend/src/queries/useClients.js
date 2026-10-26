import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { firmAdminService } from '../services/firmAdminService';
import { userService } from '../services/userService';
import { clientService } from '../services/clientService';
import { clientKeys, lookupKeys, dashboardKeys } from './keys';
import toast from 'react-hot-toast';

// ----------------------------------------------------
// QUERIES
// ----------------------------------------------------

export const useFirmClientsList = (filters = {}) => {
  const query = useQuery({
    queryKey: clientKeys.list('firm', filters),
    queryFn: () => firmAdminService.getClients(filters),
    placeholderData: keepPreviousData,
  });

  return {
    clients: query.data?.data || query.data?.clients || [],
    pagination: query.data?.pagination,
    ...query,
  };
};

export const useClientDetail = (clientId, { enabled = true } = {}) => {
  const query = useQuery({
    queryKey: clientKeys.detail(clientId),
    queryFn: () => firmAdminService.getClientById(clientId),
    enabled: Boolean(clientId && enabled),
  });

  return {
    client: query.data?.data ?? query.data,
    ...query,
  };
};

export const useMyClients = () => {
  const query = useQuery({
    queryKey: clientKeys.list('user', {}),
    queryFn: () => userService.getClients(),
  });

  return {
    clients: query.data?.data || query.data?.clients || [],
    ...query,
  };
};

// ----------------------------------------------------
// MUTATIONS
// ----------------------------------------------------

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientData) => firmAdminService.createClient(clientData),
    onSuccess: () => {
      toast.success('Client profile created successfully!');
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: lookupKeys.clients });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to create client.');
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, data }) => firmAdminService.updateClient(clientId, data),
    onSuccess: (res, variables) => {
      toast.success('Client updated successfully!');
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.clientId) });
      queryClient.invalidateQueries({ queryKey: lookupKeys.clients });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to update client.');
    },
  });
};

export const useUpdateClientStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, status }) => firmAdminService.updateClientStatus(clientId, status),
    onSuccess: (res, variables) => {
      toast.success(`Client status updated to ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.clientId) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to update client status.');
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientId) => firmAdminService.deleteClient(clientId),
    onSuccess: () => {
      toast.success('Client deleted successfully!');
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: lookupKeys.clients });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete client.');
    },
  });
};

export const useVerifyGst = () => {
  return useMutation({
    mutationFn: (gstNumber) => firmAdminService.verifyGst(gstNumber),
  });
};

export const useVerifyPan = () => {
  return useMutation({
    mutationFn: (panNumber) => firmAdminService.verifyPan(panNumber),
  });
};

export const useAddClientService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, serviceData }) => firmAdminService.addClientService(clientId, serviceData),
    onSuccess: (res, variables) => {
      toast.success('Service added to client subscription!');
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.clientId) });
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to add service');
    },
  });
};

export const useRemoveClientService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, serviceId }) => firmAdminService.removeClientService(clientId, serviceId),
    onSuccess: (res, variables) => {
      toast.success('Subscribed service removed');
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.clientId) });
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to remove service');
    },
  });
};

export const useAddClientDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, docData }) => firmAdminService.addClientDocument(clientId, docData),
    onSuccess: (res, variables) => {
      toast.success('Master document added!');
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.clientId) });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to add document');
    },
  });
};

export const useDeleteClientDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, documentId }) => firmAdminService.deleteClientDocument(clientId, documentId),
    onSuccess: (res, variables) => {
      toast.success('Document deleted');
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.clientId) });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete document');
    },
  });
};

export const useUpdateClientProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileData) => clientService.updateProfile(profileData),
    onSuccess: () => {
      toast.success('Client profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to update profile.');
    },
  });
};
