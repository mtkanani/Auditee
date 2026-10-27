import React from 'react';
import { Plus, Square, SquareCheckBig } from 'lucide-react';

export const SubtasksTab = ({ handleAddSubtask, newSubtaskTitle, setNewSubtaskTitle, task, handleToggleSubtask }) => (
  <div className="space-y-6">
    <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Add new subtask item (e.g. Reconcile GSTR-2B purchase tax credit)..."
        value={newSubtaskTitle}
        onChange={(e) => setNewSubtaskTitle(e.target.value)}
        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
      />
      <button
        type="submit"
        className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
      >
        <Plus size="1em" />
        <span>Add Item</span>
      </button>
    </form>

    <div className="space-y-2">
      {task?.subtasks?.map((s) => (
        <div
          key={s.id}
          onClick={() => handleToggleSubtask(s.id, s.isCompleted)}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
            s.isCompleted
              ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
              : 'bg-slate-950 border-slate-800 hover:border-indigo-500/40'
          }`}
        >
          <div className="flex items-center gap-3">
            {s.isCompleted ? (
              <SquareCheckBig className="w-5 h-5 text-emerald-400"  />
            ) : (
              <Square className="w-5 h-5 text-slate-500"  />
            )}
            <span className={`text-xs font-semibold ${s.isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}`}>
              {s.title}
            </span>
          </div>

          {s.completedAt && (
            <span className="text-[10px] text-emerald-400 font-bold">
              Completed {new Date(s.completedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      ))}

      {(!task?.subtasks || task.subtasks.length === 0) && (
        <p className="text-xs text-slate-500 py-6 text-center">No subtasks added yet. Type a checklist item above to begin.</p>
      )}
    </div>
  </div>
);
