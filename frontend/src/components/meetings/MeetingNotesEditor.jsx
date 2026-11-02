import React, { useState } from 'react';
import { ListChecks, Save, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Field, Textarea } from '../ui';
import { useAddMeetingNote, useConvertMoMToTasks } from '../../queries/useMeetings';

/** Minutes of meeting: write notes, save them, or let AI turn them into tasks. */
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

  const actionItems = meeting?.actionItems?.length || 0;

  return (
    <div className="space-y-4">
      <Field label="Minutes of meeting" hint="Decisions, next steps and who does what">
        {(p) => (
          <Textarea
            {...p}
            rows={8}
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            placeholder="Type meeting decisions, next steps, and action items here..."
            className="leading-relaxed"
          />
        )}
      </Field>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <ListChecks className="w-3.5 h-3.5" aria-hidden="true" />
          {actionItems === 1 ? '1 action item linked to a task' : `${actionItems} action items linked to tasks`}
        </span>
        <div className="grid grid-cols-2 sm:flex gap-2">
          <Button
            variant="soft"
            icon={Sparkles}
            loading={convertMoMMutation.isPending}
            disabled={!notesText.trim()}
            onClick={handleAIConvertToTasks}
          >
            Make tasks with AI
          </Button>
          <Button variant="primary" icon={Save} loading={addNoteMutation.isPending} onClick={handleSaveNote}>
            Save notes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeetingNotesEditor;
