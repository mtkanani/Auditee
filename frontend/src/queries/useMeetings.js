import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { meetingApi } from '../api/meetingApi';
import { meetingKeys, taskKeys, dashboardKeys } from './keys';
import toast from 'react-hot-toast';

// ----------------------------------------------------
// QUERIES
// ----------------------------------------------------

export const useMeetings = (filters = {}) => {
  const query = useQuery({
    queryKey: meetingKeys.list(filters),
    queryFn: () => meetingApi.getAll(filters),
    placeholderData: keepPreviousData,
  });

  return {
    meetings: query.data?.data || [],
    pagination: query.data?.pagination,
    ...query,
  };
};

export const useMeetingDetail = (id, { enabled = true } = {}) => {
  const query = useQuery({
    queryKey: meetingKeys.detail(id),
    queryFn: () => meetingApi.getById(id),
    enabled: Boolean(id && enabled),
  });

  return {
    meeting: query.data?.data || query.data,
    ...query,
  };
};

// ----------------------------------------------------
// MUTATIONS
// ----------------------------------------------------

export const useScheduleMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => meetingApi.schedule(data),
    onSuccess: () => {
      toast.success('Meeting scheduled successfully!');
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to schedule meeting.');
    },
  });
};

export const useUpdateMeetingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => meetingApi.updateStatus(id, status),
    onSuccess: (_data, { id, status }) => {
      toast.success(status === 'COMPLETED' ? 'Meeting marked as completed!' : `Meeting status updated to ${status}!`);
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to update meeting status.');
    },
  });
};

export const useRespondInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => meetingApi.respondInvite(id, status),
    onSuccess: (_data, { id, status }) => {
      toast.success(`Invitation ${status.toLowerCase()}!`);
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to update invitation status.');
    },
  });
};

export const useJoinMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => meetingApi.joinMeeting(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(id) });
    },
    onError: () => {
      toast.error('Could not join meeting.');
    },
  });
};

export const useAddMeetingNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, noteData }) => meetingApi.addNote(id, noteData),
    onSuccess: (_data, { id }) => {
      toast.success('Meeting notes saved successfully!');
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to save notes.');
    },
  });
};

export const useConvertMoMToTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notesText }) => meetingApi.convertMoMToTasks(id, notesText),
    onSuccess: (res, { id }) => {
      toast.success(res?.message || 'Successfully created tasks from Meeting Notes!');
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (err) => {
      toast.error(err?.message || 'AI Task conversion failed.');
    },
  });
};

export const useInviteParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, participantData }) => meetingApi.inviteParticipant(id, participantData),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(id) });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to send invitation.');
    },
  });
};
