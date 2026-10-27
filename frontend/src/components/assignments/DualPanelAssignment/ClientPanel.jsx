import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CircleCheckBig } from 'lucide-react';

export const ClientPanel = ({ filteredClients, searchClient, setSearchClient, selectedClient, setSelectedClient, assignedCountByClient }) => (
  <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col h-[520px]">
    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
      <h3 className="font-bold text-slate-100 flex items-center gap-2">
        <Briefcase size="1em" className="text-indigo-400"  />
        <span>Select Client (Optional)</span>
      </h3>
      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
        {filteredClients.length}
      </span>
    </div>

    <input
      type="text"
      placeholder="Filter clients..."
      value={searchClient}
      onChange={(e) => setSearchClient(e.target.value)}
      className="my-3 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
    />

    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
      {filteredClients.map((client) => {
        const isSelected = selectedClient?.id === client.id;
        const assignedCount = assignedCountByClient.get(client.id) || 0;

        return (
          <motion.div
            key={client.id}
            whileHover={{ x: 3 }}
            onClick={() => setSelectedClient(isSelected ? null : client)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
              isSelected
                ? 'bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-500/10'
                : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div>
              <h4 className="text-sm font-semibold text-slate-100">{client.clientName}</h4>
              <p className="text-xs text-slate-400">{client.companyName || client.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {assignedCount} Users
              </span>
              {isSelected && <CircleCheckBig className="w-4 h-4 text-indigo-400"  />}
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);
