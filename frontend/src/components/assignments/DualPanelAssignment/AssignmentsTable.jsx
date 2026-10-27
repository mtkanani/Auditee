import React from 'react';
import { Trash2 } from 'lucide-react';

export const AssignmentsTable = ({ assignments, onUnassign }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left text-sm text-slate-300">
      <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
        <tr>
          <th className="py-3 px-4">Client Name</th>
          <th className="py-3 px-4">Assigned Employee</th>
          <th className="py-3 px-4">Role / Designation</th>
          <th className="py-3 px-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/60">
        {assignments.map((item) => (
          <tr key={`${item.clientId}-${item.userId}`} className="hover:bg-slate-800/30">
            <td className="py-3.5 px-4 font-semibold text-slate-200">
              {item.client?.clientName || item.clientId}
            </td>
            <td className="py-3.5 px-4 text-slate-300">
              {item.user ? `${item.user.firstName} ${item.user.lastName}` : item.userId}
            </td>
            <td className="py-3.5 px-4 text-xs text-slate-400">
              {item.user?.designation || 'CA Staff'}
            </td>
            <td className="py-3.5 px-4 text-right">
              <button
                onClick={() => onUnassign(item.userId, item.clientId)}
                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 transition-colors"
                title="Remove Assignment"
              >
                <Trash2 className="w-4 h-4"  />
              </button>
            </td>
          </tr>
        ))}

        {assignments.length === 0 && (
          <tr>
            <td colSpan={4} className="py-8 text-center text-sm text-slate-500">
              No client-user assignments created yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
