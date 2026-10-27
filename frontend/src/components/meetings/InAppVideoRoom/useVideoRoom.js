import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { useInviteParticipant } from '../../../queries/useMeetings';
import { useFirmUsers, useFirmClients } from '../../../queries/useLookups';
import { getRole } from '../../../utils/helpers';
import { useLocalMedia } from './useLocalMedia';

export const useVideoRoom = ({ meeting }) => {
  const { user } = useAuth();
  const inviteMutation = useInviteParticipant();

  const isFirmAdmin = getRole() === 'FIRM_ADMIN';
  const { data: firmUsers = [], isLoading: loadingUsers } = useFirmUsers({}, { enabled: isFirmAdmin });
  const { data: firmClients = [], isLoading: loadingClients } = useFirmClients({}, { enabled: isFirmAdmin });

  const media = useLocalMedia();

  // In-Call Live Participant Invitation Drawer State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteSearch, setInviteSearch] = useState('');

  const availableUsers = React.useMemo(() => {
    if (!isFirmAdmin) return [];
    return (firmUsers || []).map((u) => ({
      id: u.id,
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
      email: u.email,
      role: u.role || 'EMPLOYEE',
      type: 'USER',
    }));
  }, [isFirmAdmin, firmUsers]);

  const availableClients = React.useMemo(() => {
    if (!isFirmAdmin) return [];
    return (firmClients || []).map((c) => ({
      id: c.id,
      name: c.clientName || c.companyName || 'Client',
      email: c.email,
      role: 'CLIENT',
      type: 'CLIENT',
    }));
  }, [isFirmAdmin, firmClients]);

  const loadingInvitees = isFirmAdmin && (loadingUsers || loadingClients);

  // Host Privilege Check (Firm Admin / Super Admin or Meeting Creator)
  const isHost =
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'FIRM_ADMIN' ||
    user?.role === 'ADMIN' ||
    meeting?.createdById === user?.id;

  // Remote participants list state with host mute flags
  const [participantsState, setParticipantsState] = useState(
    (meeting?.participants || []).map((p) => ({
      ...p,
      isMutedByHost: false,
      isMicOn: true,
    }))
  );

  const handleSendLiveInvite = async (person) => {
    try {
      await inviteMutation.mutateAsync({
        id: meeting.id,
        participantData: {
          email: person.email,
          userId: person.type === 'USER' ? person.id : undefined,
          clientId: person.type === 'CLIENT' ? person.id : undefined,
        },
      });

      toast.success(`Live meeting invitation sent to ${person.name} (${person.email})!`, { icon: '📩' });

      // Dynamically add to in-call participant state
      setParticipantsState((prev) => [
        ...prev,
        {
          id: person.id,
          email: person.email,
          user: person.type === 'USER' ? { firstName: person.name, lastName: '', role: person.role } : null,
          client: person.type === 'CLIENT' ? { clientName: person.name, email: person.email } : null,
          status: 'PENDING',
          isMutedByHost: false,
        },
      ]);
    } catch {
      // toast handled in mutation
    }
  };

  // 6. Host Action: Mute Participant Microphone (User / Client)
  const handleHostMuteParticipant = (pKey, pName) => {
    if (!isHost) return;

    setParticipantsState((prev) =>
      prev.map((p, idx) => {
        const idKey = p.id || p.email || idx;
        if (idKey === pKey) {
          return { ...p, isMutedByHost: true, isMicOn: false };
        }
        return p;
      })
    );

    toast.success(`Microphone of ${pName || 'Participant'} muted by Host`, {
      icon: '🎙️',
    });
  };

  return {
    ...media,
    user,
    isHost,
    isInviteOpen,
    setIsInviteOpen,
    inviteSearch,
    setInviteSearch,
    availableUsers,
    availableClients,
    loadingInvitees,
    participantsState,
    handleSendLiveInvite,
    handleHostMuteParticipant,
  };
};
