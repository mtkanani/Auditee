import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  useLeadDetail,
  useUpdateLeadStage,
  useAddCallLog,
  useAddMeetingNote,
  useAddProposal,
  useConvertToClient,
} from '../../../queries/useLeads';
import { useVoiceRecorder } from './useVoiceRecorder';

export const useLeadDetailModal = ({ leadId, isOpen, onRefresh }) => {
  const { data: lead, isLoading, error } = useLeadDetail(leadId, {
    enabled: Boolean(isOpen && leadId),
  });

  const updateStageMutation = useUpdateLeadStage();
  const addCallLogMutation = useAddCallLog();
  const addMeetingNoteMutation = useAddMeetingNote();
  const addProposalMutation = useAddProposal();
  const convertToClientMutation = useConvertToClient();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'calls' | 'meetings' | 'proposals'

  // Form states
  const [callSummary, setCallSummary] = useState('');
  const [callDuration, setCallDuration] = useState('15');
  const [callFollowUp, setCallFollowUp] = useState('');

  const voice = useVoiceRecorder({ callSummary, setCallSummary });
  const { audioBase64, setAudioBase64, setAudioBlobUrl } = voice;

  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [meetingAttendees, setMeetingAttendees] = useState('');

  const [proposalTitle, setProposalTitle] = useState('');
  const [proposedFee, setProposedFee] = useState('');
  const [billingFrequency, setBillingFrequency] = useState('MONTHLY');
  const [proposalScope, setProposalScope] = useState('');

  useEffect(() => {
    if (error) {
      toast.error('Failed to load lead details');
    }
  }, [error]);

  const handleStageChange = (newStage) => {
    updateStageMutation.mutate(
      { id: leadId, stage: newStage },
      {
        onSuccess: () => {
          if (onRefresh) onRefresh();
        },
      }
    );
  };

  const handleAddCallSubmit = (e) => {
    e.preventDefault();
    if (!callSummary.trim() && !audioBase64) {
      toast.error('Please enter call notes or record a voice note');
      return;
    }

    let finalSummary = callSummary.trim() || 'Voice Note Recording';
    if (audioBase64) {
      finalSummary = `🎙️ [Voice Note] ${finalSummary}||AUDIO:${audioBase64}`;
    }

    addCallLogMutation.mutate(
      {
        id: leadId,
        data: {
          callSummary: finalSummary,
          durationMinutes: parseInt(callDuration, 10),
          followUpDate: callFollowUp || null,
        },
      },
      {
        onSuccess: () => {
          toast.success('Call log & Voice note audio saved!');
          setCallSummary('');
          setCallFollowUp('');
          setAudioBase64(null);
          setAudioBlobUrl(null);
        },
      }
    );
  };

  const handleAddMeetingSubmit = (e) => {
    e.preventDefault();
    if (!meetingTitle.trim() || !meetingNotes.trim()) return;
    addMeetingNoteMutation.mutate(
      {
        id: leadId,
        data: {
          meetingTitle: meetingTitle.trim(),
          meetingNotes: meetingNotes.trim(),
          attendees: meetingAttendees.trim(),
        },
      },
      {
        onSuccess: () => {
          setMeetingTitle('');
          setMeetingNotes('');
          setMeetingAttendees('');
        },
      }
    );
  };

  const handleAddProposalSubmit = (e) => {
    e.preventDefault();
    if (!proposalTitle.trim() || !proposedFee) return;
    addProposalMutation.mutate(
      {
        id: leadId,
        data: {
          proposalTitle: proposalTitle.trim(),
          proposedFee: parseFloat(proposedFee),
          billingFrequency,
          scopeDescription: proposalScope.trim(),
        },
      },
      {
        onSuccess: () => {
          setProposalTitle('');
          setProposedFee('');
          setProposalScope('');
          if (onRefresh) onRefresh();
        },
      }
    );
  };

  const handleConvertToClient = () => {
    convertToClientMutation.mutate(leadId, {
      onSuccess: () => {
        if (onRefresh) onRefresh();
      },
    });
  };

  return {
    ...voice,
    lead,
    isLoading,
    activeTab,
    setActiveTab,
    callSummary,
    setCallSummary,
    callDuration,
    setCallDuration,
    callFollowUp,
    setCallFollowUp,
    meetingTitle,
    setMeetingTitle,
    meetingNotes,
    setMeetingNotes,
    meetingAttendees,
    setMeetingAttendees,
    proposalTitle,
    setProposalTitle,
    proposedFee,
    setProposedFee,
    proposalScope,
    setProposalScope,
    addCallLogMutation,
    addMeetingNoteMutation,
    addProposalMutation,
    convertToClientMutation,
    handleStageChange,
    handleAddCallSubmit,
    handleAddMeetingSubmit,
    handleAddProposalSubmit,
    handleConvertToClient,
  };
};
