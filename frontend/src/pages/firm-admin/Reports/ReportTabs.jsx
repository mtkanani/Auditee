import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { reportCategories, allTabs } from './constants';

export const ReportTabs = ({ activeTab, onSelectTab }) => {
  const tabsContainerRef = useRef(null);

  const scrollTabs = (scrollOffset) => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-3">
      {/* Mobile Dropdown View */}
      <div className="block md:hidden">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
          Select Report View
        </label>
        <select
          value={activeTab}
          onChange={(e) => onSelectTab(e.target.value)}
          className="w-full py-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
        >
          {allTabs.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Sleek Categorized Pill Tab Bar */}
      <div className="hidden md:flex flex-col gap-3 p-2 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-2xl backdrop-blur-md">
        <div className="relative flex items-center">
          {/* Left Scroll Button */}
          <button
            onClick={() => scrollTabs(-240)}
            className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-10 mr-1 shadow-md cursor-pointer"
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable Tabs Track */}
          <div
            ref={tabsContainerRef}
            className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none py-1 px-1 scroll-smooth"
          >
            {reportCategories.map((category, cIdx) => (
              <div key={cIdx} className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-slate-800/80 last:border-r-0">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-2">
                  {category.categoryName}
                </span>

                {category.tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => onSelectTab(tab.id)}
                      className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white border-indigo-400/50 shadow-lg shadow-indigo-600/30 scale-[1.03]'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-slate-100 hover:bg-slate-800/60 hover:border-slate-700'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.color}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scrollTabs(240)}
            className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-10 ml-1 shadow-md cursor-pointer"
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
