import React from 'react';
import { Layers, SquareCheckBig } from 'lucide-react';
import { AssignmentsTable } from './AssignmentsTable';
import { TasksTable } from './TasksTable';

export const AssignmentTabs = ({ activeTab, setActiveTab, assignments, tasks, onUnassign }) => (
  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'assignments'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers size="1em" />
          <span>Client-User Pairs ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'tasks'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          <SquareCheckBig size="1em" />
          <span>Assigned Firm Tasks ({tasks.length})</span>
        </button>
      </div>
    </div>

    {/* Tab 1: Client Assignments Table */}
    {activeTab === 'assignments' && <AssignmentsTable assignments={assignments} onUnassign={onUnassign} />}

    {/* Tab 2: Tasks Table */}
    {activeTab === 'tasks' && <TasksTable tasks={tasks} />}
  </div>
);
