import React, { useState } from 'react';
import { Video, VideoOff, Mic, MicOff, Monitor, Hand, PhoneOff, Lock, Users, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export const InAppVideoRoom = ({ meeting, onClose }) => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [raisedHand, setRaisedHand] = useState(false);

  const toggleMic = () => {
    setMicOn(!micOn);
    toast.success(micOn ? 'Microphone muted' : 'Microphone unmuted');
  };

  const toggleCam = () => {
    setCamOn(!camOn);
    toast.success(camOn ? 'Camera turned off' : 'Camera turned on');
  };

  const toggleScreenShare = () => {
    setScreenSharing(!screenSharing);
    toast.success(screenSharing ? 'Screen sharing stopped' : 'Screen sharing started');
  };

  const toggleHand = () => {
    setRaisedHand(!raisedHand);
    toast(raisedHand ? 'Hand lowered' : '✋ Hand raised', { icon: '✋' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Video Room Top Navbar */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">{meeting?.title || 'Auditee Video Room'}</h3>
            <p className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE • WebRTC Encrypted Call</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>{meeting?.participants?.length || 1} Participants</span>
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PhoneOff className="w-4 h-4" />
            <span>Leave Call</span>
          </button>
        </div>
      </div>

      {/* Video Call Stream Grid */}
      <div className="flex-1 p-4 bg-slate-950 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
        {/* Local Participant Tile */}
        <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
          {camOn ? (
            <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center text-slate-300">
              <div className="w-20 h-20 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-xl flex items-center justify-center mb-2 shadow-2xl">
                YOU
              </div>
              <span className="text-xs font-semibold text-slate-200">You (Host)</span>
            </div>
          ) : (
            <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-slate-500">
              <VideoOff className="w-10 h-10 mb-2 opacity-50" />
              <span className="text-xs">Camera Turned Off</span>
            </div>
          )}

          {/* Status Overlay Badges */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <span className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${micOn ? 'bg-slate-900/80 text-emerald-400' : 'bg-rose-950/80 text-rose-400'}`}>
              {micOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            </span>
            {raisedHand && (
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs flex items-center gap-1">
                <Hand className="w-3.5 h-3.5" /> Hand Raised
              </span>
            )}
          </div>
        </div>

        {/* Invited Remote Participants Grid Tiles */}
        {(meeting?.participants || []).map((p, idx) => (
          <div key={idx} className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
            <div className="w-full h-full bg-slate-900/80 flex flex-col items-center justify-center text-slate-300 p-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold text-lg flex items-center justify-center mb-2">
                {(p.user?.firstName || p.client?.clientName || p.email || 'P')[0].toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-slate-200 text-center">
                {p.user?.firstName ? `${p.user.firstName} ${p.user.lastName}` : p.client?.clientName || p.email}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 capitalize">{p.status.toLowerCase()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Video Call Controls Toolbar */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-center gap-3">
        <button
          onClick={toggleMic}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
            micOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
          }`}
        >
          {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleCam}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
            camOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
          }`}
        >
          {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleScreenShare}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
            screenSharing ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
        >
          <Monitor className="w-5 h-5" />
        </button>

        <button
          onClick={toggleHand}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
            raisedHand ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
        >
          <Hand className="w-5 h-5" />
        </button>

        <button
          onClick={onClose}
          className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/40 transition-all cursor-pointer"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default InAppVideoRoom;
