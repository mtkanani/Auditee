import React from 'react';
import { Mic, Phone, Square, Trash2 } from 'lucide-react';

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
  <form onSubmit={handleAddCallSubmit} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
    <div className="flex items-center justify-between">
      <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
        <Phone size="1em" className="text-indigo-400"  /> Log Phone Conversation
      </h4>

      {/* Active Recording Indicator Banner */}
      {isRecording && (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-extrabold animate-pulse">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>Recording Voice Note... ({formatTimer(recordingSeconds)})</span>
        </div>
      )}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="sm:col-span-2 relative flex items-center">
        <input
          type="text"
          required
          placeholder={isRecording ? "Listening & transcribing voice note..." : "Call summary / conversation notes..."}
          value={callSummary}
          onChange={(e) => setCallSummary(e.target.value)}
          className={`w-full pl-3 pr-12 py-2.5 rounded-xl bg-slate-900 border text-xs text-slate-100 transition-all ${
            isRecording
              ? 'border-rose-500/80 ring-2 ring-rose-500/20 bg-rose-950/20 text-rose-200'
              : 'border-slate-800 focus:border-indigo-500'
          }`}
        />

        {/* WhatsApp Style Mic Recorder Button */}
        <button
          type="button"
          onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
          title={isRecording ? "Stop Recording Voice Note" : "Record Voice Note (WhatsApp Style)"}
          className={`absolute right-2 p-2 rounded-lg transition-all flex items-center justify-center ${
            isRecording
              ? 'bg-rose-600 text-white animate-bounce shadow-lg shadow-rose-500/50'
              : 'bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white'
          }`}
        >
          {isRecording ? <Square className="w-4 h-4"  /> : <Mic className="w-4 h-4"  />}
        </button>
      </div>

      <div>
        <input
          type="number"
          placeholder="Duration (mins)"
          value={callDuration}
          onChange={(e) => setCallDuration(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
        />
      </div>
    </div>

    {/* Audio Recording Preview Player */}
    {audioBlobUrl && (
      <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs space-y-1.5 animate-fadeIn">
        <div className="flex items-center justify-between text-[11px] font-extrabold text-rose-300">
          <span className="flex items-center gap-1.5">
            🎙️ Voice Note Audio Preview (Ready to Save)
          </span>
          <button
            type="button"
            onClick={clearRecordedAudio}
            className="text-[10px] font-bold text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5"  />
            <span>Discard Audio</span>
          </button>
        </div>
        <audio controls src={audioBlobUrl} className="w-full h-8 rounded-lg accent-rose-500" />
      </div>
    )}

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Next Follow-Up Date:</span>
        <input
          type="date"
          value={callFollowUp}
          onChange={(e) => setCallFollowUp(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
        />
      </div>
      <button
        type="submit"
        disabled={addCallLogMutation.isPending}
        className="py-2 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-1.5"
      >
        <span>{addCallLogMutation.isPending ? 'Saving Call...' : 'Save Call Log'}</span>
      </button>
    </div>
  </form>
);
