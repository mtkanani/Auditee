import React from 'react';

export const CallLogFeed = ({ lead }) => (
  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
    {lead.callLogs?.map((log) => {
      const hasAudio = log.callSummary?.includes('||AUDIO:');
      const [summaryText, audioDataUrl] = hasAudio
        ? log.callSummary.split('||AUDIO:')
        : [log.callSummary, null];

      const cleanSummary = summaryText.replace('🎙️ [Voice Note]', '').trim();

      return (
        <div key={log.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Logged by {log.loggedName} • {log.durationMinutes ? `${log.durationMinutes} mins` : 'Call'}</span>
            <span>{new Date(log.createdAt).toLocaleString()}</span>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              {hasAudio || log.callSummary?.includes('🎙️') ? (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                  🎙️ Voice Note
                </span>
              ) : null}
              <span>{cleanSummary || 'Recorded Audio Clip'}</span>
            </p>

            {/* Interactive Audio Player */}
            {audioDataUrl && (
              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 px-1">
                  <span>Voice Note Audio Recording</span>
                  <span className="text-emerald-400 font-mono text-[9px] uppercase">Playable Clip</span>
                </div>
                <audio
                  controls
                  src={audioDataUrl}
                  className="w-full h-8 rounded-lg outline-none accent-indigo-500"
                />
              </div>
            )}
          </div>

          {log.followUpDate && (
            <p className="text-[10px] text-amber-400 font-bold">
              📅 Next Follow-Up Scheduled: {new Date(log.followUpDate).toLocaleDateString()}
            </p>
          )}
        </div>
      );
    })}
  </div>
);
