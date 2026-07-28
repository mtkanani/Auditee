import React, { useState } from 'react';
import { FileText, Sparkles, Save, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { meetingApi } from '../../api/meetingApi';

export const MeetingNotesEditor = ({ meeting, onRefresh }) => {
  const [notesText, setNotesText] = useState(
    meeting?.notes?.[0]?.description || meeting?.agenda || ''
  );
  const [saving, setSaving] = useState(false);
  const [aiConverting, setAiConverting] = useState(false);

  const handleSaveNote = async () => {
    if (!notesText.trim()) {
      toast.error('Please enter notes content.');
      return;
    }
    setSaving(true);
    try {
      await meetingApi.addNote(meeting.id, {
        title: `MoM Notes: ${meeting.title}`,
        description: notesText,
      });
      toast.success('Meeting notes saved successfully!');
      onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to save notes.');
    } finally {
      setSaving(false);
    }
  };

  const handleAIConvertToTasks = async () => {
    if (!notesText.trim()) {
      toast.error('Please enter notes content first before converting to tasks.');
      return;
    }
    setAiConverting(true);
    try {
      const response = await meetingApi.convertMoMToTasks(meeting.id, notesText);
      toast.success(response.message || 'Successfully created tasks from Meeting Notes!');
      onRefresh();
    } catch (err) {
      toast.error(err.message || 'AI Task conversion failed.');
    } finally {
      setAiConverting(false);
    }
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
          disabled={aiConverting || !notesText.trim()}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>{aiConverting ? 'AI Parsing...' : '✨ AI Convert to Tasks'}</span>
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
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving...' : 'Save MoM Notes'}</span>
        </button>
      </div>
    </div>
  );
};

export default MeetingNotesEditor;
