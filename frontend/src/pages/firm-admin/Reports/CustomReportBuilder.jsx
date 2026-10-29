import React from 'react';
import { Check, Download, Play, SlidersVertical } from 'lucide-react';
import { Button } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { CUSTOM_ENTITIES, entityFieldsMap } from './constants';
import { ReportTable } from './ReportTable';

const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50';

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
    <div className="space-y-4">
      <section className="rounded-2xl border border-line bg-surface shadow-card p-5 sm:p-6 space-y-6">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-fg">
            <SlidersVertical className="w-4 h-4 text-accent-fg" aria-hidden="true" /> Build your own report
          </h3>
          <p className="text-sm text-muted mt-1">Pick what to report on, choose the columns, then generate and export.</p>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-fg mb-2">1. What to report on</legend>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {CUSTOM_ENTITIES.map((ent) => {
              const Icon = ent.icon;
              const on = customEntity === ent.id;
              return (
                <button
                  key={ent.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => handleEntitySelect(ent.id)}
                  className={cn('p-4 rounded-xl border text-left transition-colors', focus, on ? 'border-accent bg-accent-soft/50' : 'border-line hover:border-line-strong')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn('grid place-items-center w-8 h-8 rounded-lg', on ? 'bg-accent text-on-accent' : 'bg-hover text-muted')}>
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                    {on && <Check className="w-4 h-4 text-accent-fg" aria-hidden="true" />}
                  </div>
                  <p className="text-sm font-medium text-fg">{ent.label}</p>
                  <p className="text-xs text-muted mt-0.5">{ent.desc}</p>
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <legend className="text-sm font-medium text-fg">
              2. Columns <span className="text-subtle font-normal">({customFields.length} selected)</span>
            </legend>
            <div className="flex items-center gap-3 text-sm">
              <button type="button" onClick={handleSelectAll} className="font-medium text-accent-fg hover:underline underline-offset-4">Select all</button>
              <button type="button" onClick={handleClearAll} className="text-muted hover:text-fg">Clear</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {entityFieldsMap[customEntity]?.map((f) => {
              const on = customFields.includes(f.key);
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => handleToggleField(f.key)}
                  className={cn(
                    'inline-flex items-center gap-1.5 h-8 px-3 rounded-full border text-sm transition-colors',
                    focus,
                    on ? 'border-accent/40 bg-accent-soft text-accent-fg' : 'border-line text-muted hover:text-fg hover:border-line-strong'
                  )}
                >
                  {on && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                  {f.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex justify-end pt-2">
          <Button variant="primary" icon={Play} loading={customLoading} disabled={customFields.length === 0} onClick={onRunCustomReport}>
            Generate report
          </Button>
        </div>
      </section>

      {customReportData.length > 0 && (
        <ReportTable
          title={`Your report (${customReportData.length} rows)`}
          icon={SlidersVertical}
          data={customReportData}
          paginatedData={customReportData}
          totalEntries={customReportData.length}
          formatHeader={false}
          showPagination={false}
          headerActions={
            <Button size="sm" variant="soft" icon={Download} onClick={onExportCSV}>
              Export CSV
            </Button>
          }
        />
      )}
    </div>
  );
};
