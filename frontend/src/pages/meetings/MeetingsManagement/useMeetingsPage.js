import { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useMeetings, useJoinMeeting, useUpdateMeetingStatus } from '../../../queries/useMeetings';
import { useDebounce } from '../../../hooks/useDebounce';

export const useMeetingsPage = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [activeVideoMeeting, setActiveVideoMeeting] = useState(null);
  const [activeNotesMeeting, setActiveNotesMeeting] = useState(null);

  const [page, setPage] = useState(1);

  const filters = useMemo(() => {
    const params = { page, limit: 12 };
    if (debouncedSearch) params.search = debouncedSearch;
    if (statusFilter) params.status = statusFilter;
    if (typeFilter) params.type = typeFilter;
    return params;
  }, [page, debouncedSearch, statusFilter, typeFilter]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, typeFilter]);

  const { meetings, pagination, isLoading } = useMeetings(filters);
  const joinMeetingMutation = useJoinMeeting();
  const updateStatusMutation = useUpdateMeetingStatus();

  const handleJoinMeeting = async (meeting) => {
    try {
      await joinMeetingMutation.mutateAsync(meeting.id);
      if (meeting.meetingMode === 'IN_APP_VIDEO') {
        setActiveVideoMeeting(meeting);
      } else if (meeting.meetingLink) {
        const fullUrl = meeting.meetingLink.startsWith('http') ? meeting.meetingLink : `https://${meeting.meetingLink}`;
        window.open(fullUrl, '_blank');
      } else {
        toast.success(`Meeting location: ${meeting.location || 'In-Person'}`);
      }
    } catch {
      // toast handled in mutation
    }
  };

  const handleCloseMeeting = (meetingId) => {
    updateStatusMutation.mutate({ id: meetingId, status: 'COMPLETED' });
  };

  const canSchedule = true; // Allow any firm user, employee, and client to schedule meetings

  return {
    search, setSearch,
    statusFilter, setStatusFilter,
    typeFilter, setTypeFilter,
    page, setPage,
    meetings, pagination, isLoading,
    isScheduleOpen, setIsScheduleOpen,
    activeVideoMeeting, setActiveVideoMeeting,
    activeNotesMeeting, setActiveNotesMeeting,
    handleJoinMeeting,
    joiningId: joinMeetingMutation.isPending ? joinMeetingMutation.variables : null,
    handleCloseMeeting,
    canSchedule,
  };
};
