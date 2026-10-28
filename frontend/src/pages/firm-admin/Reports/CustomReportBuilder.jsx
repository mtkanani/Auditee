import React from 'react';
import { SlidersVertical, Check, RefreshCw, CircleCheckBig, Download } from 'lucide-react';
import { CUSTOM_ENTITIES, entityFieldsMap } from './constants';
import { ReportTable } from './ReportTable';

export const CustomReportBuilder = ({
  customEntity,
  onEntityChange,
  customFields,
  onFieldsChange,
  onRunCustomReport,
  customLoading,
  customReportData = [],
  onExportCSV,
}) => {
  const handleEntitySelect = (entId) => {
    onEntityChange(entId);
    onFieldsChange(entityFieldsMap[entId]?.map((f) => f.key) || []);
  };

  const handleToggleField = (key) => {
    if (customFields.includes(key)) {
      onFieldsChange(customFields.filter((k) => k !== key));
    } else {
      onFieldsChange([...customFields, key]);
    }
  };

  const handleSelectAll = () => {
    onFieldsChange(entityFieldsMap[customEntity]?.map((f) => f.key) || []);
  };

  const handleClearAll = () => {
    onFieldsChange([]);
  };
  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-2xl backdrop-blur-md space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-fg flex items-center gap-2">
              <SlidersVertical className="w-5 h-5 text-indigo-400" />
              <span>Custom Report Builder</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure data entities, select custom column attributes, and generate exported datasets.
            </p>
          </div>
        </div>

        {/* Step 1: Entity Cards */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Step 1: Choose Primary Data Entity
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CUSTOM_ENTITIES.map((ent) => {
              const Icon = ent.icon;
              const isSelected = customEntity === ent.id;
              return (
                <button
                  key={ent.id}
                  onClick={() => handleEntitySelect(ent.id)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-indigo-600/30 to-indigo-950/60 border-indigo-500 shadow-xl shadow-indigo-600/20'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-xl bg-slate-900 ${ent.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <p className="text-xs font-bold text-fg">{ent.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{ent.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Custom Columns Selector Chips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Step 2: Select Attributes ({customFields.length} selected)
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAll}
                className="text-xs text-indigo-400 font-bold hover:underline cursor-pointer"
              >
                Select All
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={handleClearAll}
                className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            {entityFieldsMap[customEntity]?.map((f) => {
              const isChecked = customFields.includes(f.key);
              return (
                <button
                  key={f.key}
                  onClick={() => handleToggleField(f.key)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                    isChecked
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isChecked ? (
                    <Check className="w-3.5 h-3.5 text-indigo-400" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                  )}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onRunCustomReport}
            disabled={customLoading || customFields.length === 0}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-xl shadow-indigo-600/25 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 transition-all flex items-center gap-2 cursor-pointer"
          >
            {customLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CircleCheckBig className="w-4 h-4" />
            )}
            <span>Generate Custom Dataset</span>
          </button>
        </div>
      </div>

      {/* Reusable ReportTable for Custom Report Results */}
      {customReportData.length > 0 && (
        <ReportTable
          title={`Custom Dataset (${customReportData.length} rows)`}
          icon={SlidersVertical}
          data={customReportData}
          paginatedData={customReportData}
          totalEntries={customReportData.length}
          formatHeader={false}
          showPagination={false}
          headerActions={
            <button
              onClick={onExportCSV}
              className="py-2 px-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Custom CSV</span>
            </button>
          }
        />
      )}
    </div>
  );
};
