import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, Monitor, Hand, PhoneOff, Users, Shield, VolumeX, CheckCircle, UserPlus, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../services/axiosInstance';
import meetingApi from '../../api/meetingApi';

export const InAppVideoRoom = ({ meeting, onClose }) => {
  const { user } = useAuth();

  // Media streams & video element references
  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [raisedHand, setRaisedHand] = useState(false);
  const [mutedByHostLocal, setMutedByHostLocal] = useState(false);

  // In-Call Live Participant Invitation Drawer State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteSearch, setInviteSearch] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableClients, setAvailableClients] = useState([]);
  const [loadingInvitees, setLoadingInvitees] = useState(false);

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

  // 1. Initialize local camera & microphone streams
  useEffect(() => {
    let isMounted = true;

    const startLocalMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!isMounted) return;

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setCamOn(true);
        setMicOn(true);
      } catch (err) {
        console.warn('Unable to access video/mic devices:', err.message);
        toast.error('Unable to access camera or microphone. Please check browser permissions.');
        setCamOn(false);
        setMicOn(false);
      }
    };

    startLocalMedia();

    return () => {
      isMounted = false;
      // Cleanup streams on exit
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Fetch Firm Users & Clients for Live Call Invitation
  const fetchInviteOptions = async () => {
    setLoadingInvitees(true);
    try {
      const [usersRes, clientsRes] = await Promise.all([
        axiosInstance.get('/firm-admin/users').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/firm-admin/clients').catch(() => ({ data: { data: [] } })),
      ]);

      const uList = (usersRes.data?.data || usersRes.data?.users || []).map((u) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        role: u.role || 'EMPLOYEE',
        type: 'USER',
      }));

      const cList = (clientsRes.data?.data || clientsRes.data?.clients || []).map((c) => ({
        id: c.id,
        name: c.clientName || c.companyName || 'Client',
        email: c.email,
        role: 'CLIENT',
        type: 'CLIENT',
      }));

      setAvailableUsers(uList);
      setAvailableClients(cList);
    } catch (err) {
      console.warn('Failed to load invite options:', err);
    } finally {
      setLoadingInvitees(false);
    }
  };

  const handleSendLiveInvite = async (person) => {
    try {
      await meetingApi.inviteParticipant(meeting.id, {
        email: person.email,
        userId: person.type === 'USER' ? person.id : undefined,
        clientId: person.type === 'CLIENT' ? person.id : undefined,
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
    } catch (err) {
      toast.error(err.message || 'Failed to send invitation.');
    }
  };

  // 2. Toggle Microphone
  const toggleMic = () => {
    if (mutedByHostLocal) {
      toast.error('Your microphone was muted by the meeting Host.');
      return;
    }

    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !micOn;
      });
    }

    setMicOn(!micOn);
    toast.success(!micOn ? 'Microphone unmuted' : 'Microphone muted');
  };

  // 3. Toggle Camera
  const toggleCam = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !camOn;
      });
    }

    setCamOn(!camOn);
    toast.success(!camOn ? 'Camera turned on' : 'Camera turned off');
  };

  // 4. Toggle Screen Sharing (Whole Screen / Window / Chrome Tab selector)
  const toggleScreenShare = async () => {
    if (screenSharing) {
      // Stop Screen Share
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      setScreenSharing(false);
      toast.success('Screen sharing stopped');
    } else {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface: 'monitor',
          },
          audio: true,
        });

        screenStreamRef.current = displayStream;
        setScreenSharing(true);
        toast.success('Screen sharing started! Choose Entire Screen, Window, or Tab.');

        setTimeout(() => {
          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = displayStream;
          }
        }, 100);

        displayStream.getVideoTracks()[0].onended = () => {
          setScreenSharing(false);
          screenStreamRef.current = null;
          toast.info('Screen sharing ended');
        };
      } catch (err) {
        console.warn('Screen share canceled/failed:', err);
        if (err.name !== 'NotAllowedError') {
          toast.error('Failed to share screen.');
        }
      }
    }
  };

  // 5. Toggle Hand Raise
  const toggleHand = () => {
    setRaisedHand(!raisedHand);
    toast(raisedHand ? 'Hand lowered' : '✋ Hand raised', { icon: '✋' });
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans">
      {/* Video Room Top Navbar */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>{meeting?.title || 'Auditee HD Video Room'}</span>
              {isHost && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-extrabold uppercase">
                  HOST
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE • WebRTC Real-Time Call</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 text-indigo-300 border border-slate-800 flex items-center gap-1.5 font-medium">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>{(participantsState.length || 0) + 1} Participants</span>
          </span>

          {isHost && (
            <button
              onClick={() => {
                fetchInviteOptions();
                setIsInviteOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Invite Participant</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PhoneOff className="w-4 h-4" />
            <span>Leave Call</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 bg-slate-950 overflow-y-auto flex flex-col gap-4">
        {/* Screen Share Display Container */}
        {screenSharing && (
          <div className="w-full relative rounded-3xl bg-slate-900 border-2 border-indigo-500/50 overflow-hidden shadow-2xl min-h-[380px] max-h-[500px] flex items-center justify-center">
            <video
              ref={screenVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain bg-black"
            />
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-indigo-950/90 border border-indigo-500/40 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-md">
              <Monitor className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Screen Sharing Active (Entire Screen / Window / Tab)</span>
            </div>
          </div>
        )}

        {/* Video Call Stream Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          {/* Local User Stream Tile */}
          <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center min-h-[240px] shadow-lg group">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${camOn ? 'block' : 'hidden'}`}
            />

            {!camOn && (
              <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-slate-500 p-4">
                <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold text-xl flex items-center justify-center mb-2 shadow-inner">
                  {(user?.firstName || 'Y')[0].toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-slate-300">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'You'}
                </span>
                <span className="text-[10px] text-slate-500 mt-1">Camera Turned Off</span>
              </div>
            )}

            {/* Local Stream Overlay Badges */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold border border-slate-800 flex items-center gap-1.5">
                <span>{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'You'}</span>
                {isHost && <span className="text-[9px] text-indigo-400 font-extrabold uppercase">(Host)</span>}
              </span>

              <span
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 backdrop-blur-md ${
                  micOn && !mutedByHostLocal
                    ? 'bg-slate-900/80 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                }`}
              >
                {micOn && !mutedByHostLocal ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              </span>

              {mutedByHostLocal && (
                <span className="px-2 py-1 rounded-lg bg-rose-950/90 text-rose-300 border border-rose-500/40 text-[10px] font-bold flex items-center gap-1">
                  <VolumeX className="w-3 h-3" /> Muted by Host
                </span>
              )}

              {raisedHand && (
                <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                  <Hand className="w-3 h-3" /> Hand Raised
                </span>
              )}
            </div>
          </div>

          {/* Invited Remote Participants (Users / Clients) */}
          {participantsState.map((p, idx) => {
            const pKey = p.id || p.email || idx;
            const pName = p.user?.firstName
              ? `${p.user.firstName} ${p.user.lastName}`
              : p.client?.clientName || p.email || `Participant ${idx + 1}`;
            const pRole = p.user?.role || (p.client ? 'CLIENT' : 'PARTICIPANT');

            return (
              <div
                key={pKey}
                className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center min-h-[240px] shadow-lg group"
              >
                {/* Participant Display Avatar */}
                <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-4">
                  <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 text-slate-200 font-bold text-lg flex items-center justify-center mb-2 shadow-md">
                    {pName[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 text-center">{pName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 mt-1 uppercase font-bold tracking-wider">
                    {pRole}
                  </span>
                </div>

                {/* Participant Overlay & Controls */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <span
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 backdrop-blur-md ${
                      !p.isMutedByHost
                        ? 'bg-slate-900/80 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {!p.isMutedByHost ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  </span>

                  {p.isMutedByHost && (
                    <span className="px-2 py-1 rounded-lg bg-rose-950/90 text-rose-300 border border-rose-500/40 text-[10px] font-bold flex items-center gap-1">
                      <VolumeX className="w-3 h-3" /> Muted by Host
                    </span>
                  )}
                </div>

                {/* Host Control: Mute Mic Button for Host / Firm Admin */}
                {isHost && (
                  <div className="absolute top-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity">
                    {!p.isMutedByHost ? (
                      <button
                        onClick={() => handleHostMuteParticipant(pKey, pName)}
                        className="py-1.5 px-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-[11px] font-bold shadow-lg flex items-center gap-1.5 cursor-pointer border border-rose-400/50 transition-all hover:scale-105"
                        title="Host Control: Mute Microphone of this participant"
                      >
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Mute Mic</span>
                      </button>
                    ) : (
                      <span className="py-1 px-2.5 rounded-xl bg-slate-950/90 text-slate-400 border border-slate-800 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-slate-500" />
                        <span>Muted</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Call Controls Toolbar */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-center gap-3 shadow-2xl">
        <button
          onClick={toggleMic}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
            micOn && !mutedByHostLocal
              ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              : 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
          }`}
          title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {micOn && !mutedByHostLocal ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleCam}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
            camOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
          }`}
          title={camOn ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleScreenShare}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
            screenSharing
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
          title="Share Screen (Entire Screen, Window, or Tab)"
        >
          <Monitor className="w-5 h-5" />
        </button>

        <button
          onClick={toggleHand}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
            raisedHand ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
          title="Raise Hand"
        >
          <Hand className="w-5 h-5" />
        </button>

        <button
          onClick={onClose}
          className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/40 transition-all cursor-pointer"
          title="Leave Meeting Call"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>

      {/* In-Call Live Participant Invitation Drawer Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-100">Invite Users & Clients to Live Call</h3>
              </div>
              <button onClick={() => setIsInviteOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 flex-1 overflow-y-auto">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search employees or clients by name/email..."
                  value={inviteSearch}
                  onChange={(e) => setInviteSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {loadingInvitees ? (
                <p className="text-center py-6 text-xs text-slate-400">Loading directory...</p>
              ) : (
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                  {[...availableUsers, ...availableClients]
                    .filter((p) =>
                      !inviteSearch ||
                      p.name.toLowerCase().includes(inviteSearch.toLowerCase()) ||
                      p.email.toLowerCase().includes(inviteSearch.toLowerCase())
                    )
                    .map((person) => (
                      <div
                        key={`${person.type}-${person.id}`}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 font-bold text-xs text-slate-200 flex items-center justify-center">
                            {person.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-200">{person.name}</p>
                            <p className="text-[10px] text-slate-400">
                              {person.email} • <span className="text-indigo-400 font-semibold">{person.role}</span>
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSendLiveInvite(person)}
                          className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Invite</span>
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InAppVideoRoom;
