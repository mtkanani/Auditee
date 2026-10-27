import React from 'react';
import { Briefcase, Clock, DollarSign, Folder, Layers } from 'lucide-react';

export const DetailTabs = ({ activeTab, setActiveTab, client }) => (
  <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/60 overflow-x-auto">
    <button
      onClick={() => setActiveTab('profile')}
      className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
        activeTab === 'profile'
          ? 'border-indigo-500 text-indigo-400'
          : 'border-transparent text-slate-400 hover:text-slate-200'
      }`}
    >
      <Briefcase className="w-4 h-4"  />
      <span>Profile & Tax Info</span>
    </button>

    <button
      onClick={() => setActiveTab('services')}
      className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
        activeTab === 'services'
          ? 'border-purple-500 text-purple-400'
          : 'border-transparent text-slate-400 hover:text-slate-200'
      }`}
    >
      <Layers className="w-4 h-4"  />
      <span>Services Subscribed ({client?.services?.length || 0})</span>
    </button>

    <button
      onClick={() => setActiveTab('billing')}
      className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
        activeTab === 'billing'
          ? 'border-emerald-500 text-emerald-400'
          : 'border-transparent text-slate-400 hover:text-slate-200'
      }`}
    >
      <DollarSign className="w-4 h-4"  />
      <span>Billing & Financials</span>
    </button>

    <button
      onClick={() => setActiveTab('documents')}
      className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
        activeTab === 'documents'
          ? 'border-amber-500 text-amber-400'
          : 'border-transparent text-slate-400 hover:text-slate-200'
      }`}
    >
      <Folder className="w-4 h-4"  />
      <span>Master Documents ({client?.documents?.length || 0})</span>
    </button>

    <button
      onClick={() => setActiveTab('history')}
      className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 ${
        activeTab === 'history'
          ? 'border-blue-500 text-blue-400'
          : 'border-transparent text-slate-400 hover:text-slate-200'
      }`}
    >
      <Clock className="w-4 h-4"  />
      <span>Activity History ({client?.activityLogs?.length || 0})</span>
    </button>
  </div>
);
