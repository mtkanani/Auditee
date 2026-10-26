import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import { leadService } from '../services/leadService';
import { leadKeys, clientKeys, dashboardKeys } from './keys';
import { queryClient } from '../lib/queryClient';
import toast from 'react-hot-toast';

export const useLeads = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: leadKeys.list(filters),
    queryFn: async () => {
      const res = await leadService.getAllLeads(filters);
      return res.data || res || [];
    },
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useLeadDetail = (leadId, options = {}) => {
  return useQuery({
    queryKey: leadKeys.detail(leadId),
    queryFn: async () => {
      const res = await leadService.getLeadById(leadId);
      return res.data || res || null;
    },
    ...options,
  });
};

export const useCreateLead = () => {
  return useMutation({
    mutationFn: (data) => leadService.createLead(data),
    onSuccess: () => {
      toast.success('New lead created successfully!');
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create lead');
    },
  });
};

export const useUpdateLeadStage = () => {
  return useMutation({
    mutationFn: ({ id, stage }) => leadService.updateLeadStage(id, stage),
    onSuccess: (_data, variables) => {
      toast.success(`Lead moved to ${variables.stage.replace('_', ' ')}!`);
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update lead stage');
    },
  });
};

export const useAddCallLog = () => {
  return useMutation({
    mutationFn: ({ id, data }) => leadService.addCallLog(id, data),
    onSuccess: (_data, variables) => {
      toast.success('Call log recorded successfully!');
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to save call log');
    },
  });
};

export const useAddMeetingNote = () => {
  return useMutation({
    mutationFn: ({ id, data }) => leadService.addMeetingNote(id, data),
    onSuccess: (_data, variables) => {
      toast.success('Meeting notes saved successfully!');
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to save meeting note');
    },
  });
};

export const useAddProposal = () => {
  return useMutation({
    mutationFn: ({ id, data }) => leadService.addProposal(id, data),
    onSuccess: (_data, variables) => {
      toast.success('Proposal sent & recorded!');
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to send proposal');
    },
  });
};

export const useConvertToClient = () => {
  return useMutation({
    mutationFn: (id) => leadService.convertToClient(id),
    onSuccess: (_data, id) => {
      toast.success('⚡ Lead converted to Master Client successfully!');
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to convert lead to client');
    },
  });
};
