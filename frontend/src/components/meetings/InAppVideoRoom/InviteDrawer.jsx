import React from 'react';
import { Search, UserPlus, X } from 'lucide-react';

export const InviteDrawer = ({
  setIsInviteOpen,
  inviteSearch,
  setInviteSearch,
  loadingInvitees,
  availableUsers,
  availableClients,
  handleSendLiveInvite,
}) => (
  <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
    <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">Invite Users & Clients to Live Call</h3>
        </div>
        <button onClick={() => setIsInviteOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-fg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search employees or clients by name/email..."
            value={inviteSearch}
            onChange={(e) => setInviteSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-fg focus:outline-none focus:border-indigo-500"
          />
        </div>

        {loadingInvitees ? (
          <p className="text-center py-6 text-xs text-slate-400">Loading directory...</p>
        ) : (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {inviteSearch && inviteSearch.includes('@') && ![...availableUsers, ...availableClients].some((p) => p.email.toLowerCase() === inviteSearch.trim().toLowerCase()) && (
              <div className="p-3 rounded-xl bg-indigo-950/50 border border-indigo-500/40 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs font-bold text-slate-100">{inviteSearch.trim()}</p>
                  <p className="text-[10px] text-indigo-400 font-medium">Invite by email address</p>
                </div>
                <button
                  onClick={() => handleSendLiveInvite({ name: inviteSearch.trim(), email: inviteSearch.trim(), type: 'EMAIL' })}
                  className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Invite</span>
                </button>
              </div>
            )}

            {[...availableUsers, ...availableClients]
              .filter((p) =>
                !inviteSearch ||
                p.name.toLowerCase().includes(inviteSearch.toLowerCase()) ||
                p.email.toLowerCase().includes(inviteSearch.toLowerCase())
              )
              .map((person) => (
                <div
                  key={`${person.type}-${person.id}`}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 font-bold text-xs text-slate-200 flex items-center justify-center">
                      {person.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">{person.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {person.email} • <span className="text-indigo-400 font-semibold">{person.role}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendLiveInvite(person)}
                    className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Invite</span>
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  </div>
);
