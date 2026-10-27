import React from 'react';
import { Hand, Mic, MicOff, Monitor, PhoneOff, Video, VideoOff } from 'lucide-react';

export const ControlsToolbar = ({
  toggleMic,
  micOn,
  mutedByHostLocal,
  toggleCam,
  camOn,
  toggleScreenShare,
  screenSharing,
  toggleHand,
  raisedHand,
  onClose,
}) => (
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
);
