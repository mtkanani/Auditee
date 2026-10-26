import React, { useState } from 'react';
import { FileText, Sparkles, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAddMeetingNote, useConvertMoMToTasks } from '../../queries/useMeetings';

export const MeetingNotesEditor = ({ meeting, onRefresh }) => {
  const [notesText, setNotesText] = useState(
    meeting?.notes?.[0]?.description || meeting?.agenda || ''
  );
  const addNoteMutation = useAddMeetingNote();
  const convertMoMMutation = useConvertMoMToTasks();

  const handleSaveNote = () => {
    if (!notesText.trim()) {
      toast.error('Please enter notes content.');
      return;
    }
    addNoteMutation.mutate({
      id: meeting.id,
      noteData: {
        title: `MoM Notes: ${meeting.title}`,
        description: notesText,
      },
    }, {
      onSuccess: () => {
        onRefresh?.();
      },
    });
  };

  const handleAIConvertToTasks = () => {
    if (!notesText.trim()) {
      toast.error('Please enter notes content first before converting to tasks.');
      return;
    }
    convertMoMMutation.mutate({
      id: meeting.id,
      notesText,
    }, {
      onSuccess: () => {
        onRefresh?.();
      },
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">Minutes of Meeting (MoM) & Notes</h4>
            <p className="text-[11px] text-slate-400">Record discussion decisions & action items</p>
          </div>
        </div>

        {/* ✨ AI Task Generator Button */}
        <button
          onClick={handleAIConvertToTasks}
          disabled={convertMoMMutation.isPending || !notesText.trim()}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>{convertMoMMutation.isPending ? 'AI Parsing...' : '✨ AI Convert to Tasks'}</span>
        </button>
      </div>

      {/* Editor Textarea */}
      <textarea
        rows={6}
        value={notesText}
        onChange={(e) => setNotesText(e.target.value)}
        placeholder="Type meeting decisions, next steps, and action items here..."
        className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
      />

      {/* Footer Controls & Saved Action Items */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] text-slate-400">
          {meeting?.actionItems?.length || 0} Action Items linked to Auditee Tasks
        </span>
        <button
          onClick={handleSaveNote}
          disabled={addNoteMutation.isPending}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{addNoteMutation.isPending ? 'Saving...' : 'Save MoM Notes'}</span>
        </button>
      </div>
    </div>
  );
};

export default MeetingNotesEditor;
