import React from 'react';

export const ClientHeader = ({ client }) => (
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-500/20">
      {client?.companyName?.[0] || client?.clientName?.[0] || 'C'}
    </div>

    <div>
      <div className="flex items-center gap-2">
        <span className="block text-xl font-extrabold text-slate-100 tracking-tight">
          {client?.companyName || client?.clientName}
        </span>
        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
          {client?.clientType || 'CLIENT'}
        </span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
            client?.status === 'ACTIVE'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          {client?.status || 'ACTIVE'}
        </span>
      </div>
      <p className="text-xs font-normal text-slate-400 mt-0.5 flex items-center gap-3">
        <span>Client ID: #{client?.id}</span>
        <span>•</span>
        <span>{client?.email}</span>
        {client?.phone && (
          <>
            <span>•</span>
            <span>{client?.phone}</span>
          </>
        )}
      </p>
    </div>
  </div>
);
