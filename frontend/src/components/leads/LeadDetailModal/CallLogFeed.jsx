import React from 'react';
import { CalendarClock, Mic, PhoneCall } from 'lucide-react';
import { Badge } from '../../ui';

const when = (d) => new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

export const CallLogFeed = ({ lead }) => {
  if (!lead.callLogs?.length) {
    return (
      <div className="flex flex-col items-center py-10 text-center rounded-2xl border border-dashed border-line">
        <PhoneCall className="w-5 h-5 text-subtle mb-2" aria-hidden="true" />
        <p className="text-sm text-muted">No calls logged yet.</p>
      </div>
    );
  }

  return (
    <ol className="space-y-3">
      {lead.callLogs.map((log) => {
        const hasAudio = log.callSummary?.includes('||AUDIO:');
        const [summaryText, audioDataUrl] = hasAudio ? log.callSummary.split('||AUDIO:') : [log.callSummary, null];
        const cleanSummary = summaryText.replace('🎙️ [Voice Note]', '').trim();
        const isVoice = hasAudio || log.callSummary?.includes('🎙️');

        return (
          <li key={log.id} className="rounded-xl border border-line bg-surface p-4 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-subtle">
              <span>
                {log.loggedName} · {log.durationMinutes ? `${log.durationMinutes} min` : 'Call'}
              </span>
              <span className="tabular-nums">{when(log.createdAt)}</span>
            </div>

            <div className="flex items-start gap-2">
              {isVoice && (
                <Badge tone="accent" className="shrink-0">
                  <Mic className="w-3 h-3" aria-hidden="true" /> Voice note
                </Badge>
              )}
              <p className="text-sm text-fg">{cleanSummary || 'Recorded audio clip'}</p>
            </div>

            {audioDataUrl && <audio controls src={audioDataUrl} className="w-full h-9" />}

            {log.followUpDate && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-warning">
                <CalendarClock className="w-3.5 h-3.5" aria-hidden="true" />
                Follow up on {new Date(log.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
};
