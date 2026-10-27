import React from 'react';
import { Plus, SquareCheckBig, UserCheck } from 'lucide-react';

export const ActionColumn = ({ handleAssignClick, selectedClient, selectedUser, isLoading, handleOpenTaskModal }) => (
  <div className="lg:col-span-1 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-center items-center text-center space-y-4">
    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
      <UserCheck className="w-8 h-8"  />
    </div>

    <div>
      <h4 className="text-sm font-bold text-slate-200">Workstation Actions</h4>
      <p className="text-xs text-slate-400 mt-1">Pair client-user or assign direct tasks.</p>
    </div>

    {/* Action 1: Pair Client & User */}
    <button
      onClick={handleAssignClick}
      disabled={!selectedClient || !selectedUser || isLoading}
      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
      title="Requires both 1 Client and 1 Employee selected"
    >
      <Plus className="w-4 h-4"  />
      <span>Pair Client</span>
    </button>

    {/* Action 2: Assign Direct Task */}
    <button
      onClick={handleOpenTaskModal}
      disabled={!selectedUser || isLoading}
      className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold text-xs border border-purple-500/30 hover:border-purple-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
      title="Assign a direct task to the selected employee (Client optional)"
    >
      <SquareCheckBig className="w-4 h-4 text-purple-400"  />
      <span>Direct Task</span>
    </button>
  </div>
);
