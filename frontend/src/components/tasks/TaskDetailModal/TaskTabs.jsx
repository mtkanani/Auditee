import React from 'react';
import { Clock, MessageSquare, Paperclip, SquareCheckBig } from 'lucide-react';

export const TaskTabs = ({ activeTab, setActiveTab, totalSubtasks, task }) => (
  <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/60 overflow-x-auto">
    <button
      onClick={() => setActiveTab('subtasks')}
      className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
        activeTab === 'subtasks' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
      }`}
    >
      <SquareCheckBig className="w-4 h-4"  />
      <span>Subtasks Checklist ({totalSubtasks})</span>
    </button>

    <button
      onClick={() => setActiveTab('comments')}
      className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
        activeTab === 'comments' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'
      }`}
    >
      <MessageSquare className="w-4 h-4"  />
      <span>Discussion Thread ({task?.comments?.length || 0})</span>
    </button>

    <button
      onClick={() => setActiveTab('documents')}
      className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
        activeTab === 'documents' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
      }`}
    >
      <Paperclip className="w-4 h-4"  />
      <span>Attachments ({task?.documents?.length || 0})</span>
    </button>

    <button
      onClick={() => setActiveTab('history')}
      className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
        activeTab === 'history' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
      }`}
    >
      <Clock className="w-4 h-4"  />
      <span>Audit History ({task?.history?.length || 0})</span>
    </button>
  </div>
);
