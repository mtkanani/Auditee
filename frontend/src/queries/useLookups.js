import { useQuery } from '@tanstack/react-query';
import { firmAdminService } from '../services/firmAdminService';
import { lookupKeys } from './keys';

export const useFirmUsers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: lookupKeys.users(params),
    queryFn: async () => {
      const res = await firmAdminService.getUsers(params);
      return res.data || res.users || res.clients || [];
    },
    staleTime: 5 * 60_000,
    ...options,
  });
};

export const useFirmClients = (params = {}, options = {}) => {
  return useQuery({
    queryKey: lookupKeys.clients(params),
    queryFn: async () => {
      const res = await firmAdminService.getClients(params);
      return res.data || res.users || res.clients || [];
    },
    staleTime: 5 * 60_000,
    ...options,
  });
};
