import React from 'react';
import { CheckCircle, Mic, MicOff, VolumeX } from 'lucide-react';
import { LocalVideoTile } from './LocalVideoTile';

export const VideoGrid = (props) => {
  const { participantsState, isHost, handleHostMuteParticipant } = props;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
      {/* Local User Stream Tile */}
      <LocalVideoTile {...props} />

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
  );
};
