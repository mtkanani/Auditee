import React from 'react';
import { Calendar, FileText, Phone, User } from 'lucide-react';

export const LeadTabs = ({ lead, activeTab, setActiveTab }) => (
  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
    {[
      { id: 'overview', label: 'Lead Overview', icon: User },
      { id: 'calls', label: `Call History (${lead.callLogs?.length || 0})`, icon: Phone },
      { id: 'meetings', label: `Meeting Notes (${lead.meetingNotes?.length || 0})`, icon: Calendar },
      { id: 'proposals', label: `Proposals (${lead.proposals?.length || 0})`, icon: FileText },
    ].map((tab) => {
      const Icon = tab.icon;
      return (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === tab.id
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
          <span>{tab.label}</span>
        </button>
      );
    })}
  </div>
);
