import React from 'react';
import { PhoneOff, UserPlus, Users, Video } from 'lucide-react';

export const RoomTopBar = ({ meeting, isHost, participantsState, setIsInviteOpen, onClose }) => (
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
          onClick={() => setIsInviteOpen(true)}
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
);
