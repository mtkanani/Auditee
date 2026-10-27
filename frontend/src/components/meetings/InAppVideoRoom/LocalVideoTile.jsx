import React from 'react';
import { Hand, Mic, MicOff, VolumeX } from 'lucide-react';

export const LocalVideoTile = ({ localVideoRef, camOn, user, isHost, micOn, mutedByHostLocal, raisedHand }) => (
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
);
