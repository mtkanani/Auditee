import React from 'react';
import { Mic, Square, Trash2 } from 'lucide-react';
import { Button, Field, Input } from '../../ui';
import { cn } from '../../../lib/cn';

export const CallLogForm = ({
  handleAddCallSubmit,
  isRecording,
  recordingSeconds,
  formatTimer,
  callSummary,
  setCallSummary,
  stopVoiceRecording,
  startVoiceRecording,
  callDuration,
  setCallDuration,
  audioBlobUrl,
  clearRecordedAudio,
  callFollowUp,
  setCallFollowUp,
  addCallLogMutation,
}) => (
  <form onSubmit={handleAddCallSubmit} className="rounded-2xl border border-line bg-surface p-5 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="text-sm font-semibold text-fg">Log a call</h4>
      {isRecording && (
        <span role="status" className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-danger-soft text-danger text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-danger animate-pulse" aria-hidden="true" />
          Recording {formatTimer(recordingSeconds)}
        </span>
      )}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <Field label="What was discussed" required className="sm:col-span-3">
        {(p) => (
          <div className="relative">
            <Input
              {...p}
              required
              placeholder={isRecording ? 'Listening and transcribing…' : 'Call summary, or record a voice note'}
              value={callSummary}
              onChange={(e) => setCallSummary(e.target.value)}
              className={cn('pr-12', isRecording && 'border-danger/60 ring-4 ring-danger/15')}
            />
            <Button
              size="icon-sm"
              variant={isRecording ? 'danger' : 'soft'}
              aria-label={isRecording ? 'Stop recording' : 'Record a voice note'}
              aria-pressed={isRecording}
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
        )}
      </Field>
      <Field label="Minutes">
        {(p) => <Input {...p} type="number" placeholder="15" value={callDuration} onChange={(e) => setCallDuration(e.target.value)} />}
      </Field>
    </div>

    {audioBlobUrl && (
      <div className="p-3 rounded-xl border border-line bg-sunken/60 space-y-2">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-medium text-fg">Voice note ready to save</span>
          <Button size="sm" variant="ghost" icon={Trash2} onClick={clearRecordedAudio} className="text-danger">
            Discard
          </Button>
        </div>
        <audio controls src={audioBlobUrl} className="w-full h-9" />
      </div>
    )}

    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <Field label="Next follow-up" className="sm:w-52">
        {(p) => <Input {...p} type="date" value={callFollowUp} onChange={(e) => setCallFollowUp(e.target.value)} />}
      </Field>
      <Button type="submit" variant="primary" loading={addCallLogMutation.isPending}>
        Save call
      </Button>
    </div>
  </form>
);
