import React from 'react';

export const TasksTable = ({ tasks }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left text-sm text-slate-300">
      <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
        <tr>
          <th className="py-3 px-4">Task Title</th>
          <th className="py-3 px-4">Assigned User</th>
          <th className="py-3 px-4">Client Scope</th>
          <th className="py-3 px-4">Priority</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4 text-right">Due Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/60">
        {tasks.map((task) => (
          <tr key={task.id} className="hover:bg-slate-800/30">
            <td className="py-3.5 px-4 font-semibold text-slate-200">
              {task.title}
              {task.description && (
                <p className="text-xs text-slate-400 font-normal line-clamp-1">
                  {task.description}
                </p>
              )}
            </td>
            <td className="py-3.5 px-4 text-slate-300">
              {task.user ? `${task.user.firstName} ${task.user.lastName}` : 'Unassigned'}
            </td>
            <td className="py-3.5 px-4 text-xs">
              {task.client ? (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                  {task.client.clientName}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                  Direct Task
                </span>
              )}
            </td>
            <td className="py-3.5 px-4 text-xs font-semibold">
              <span
                className={`px-2 py-0.5 rounded-md ${
                  task.priority === 'URGENT'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : task.priority === 'HIGH'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}
              >
                {task.priority}
              </span>
            </td>
            <td className="py-3.5 px-4 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                {task.status}
              </span>
            </td>
            <td className="py-3.5 px-4 text-right text-xs text-slate-400">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
            </td>
          </tr>
        ))}

        {tasks.length === 0 && (
          <tr>
            <td colSpan={6} className="py-8 text-center text-sm text-slate-500">
              No firm tasks created yet. Use the "Direct Task" button above to assign tasks!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
