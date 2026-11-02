import React from 'react';
import { ChartColumn, ChartSpline } from 'lucide-react';

/** Legend: one swatch + label per series (text stays in text colours; the swatch carries identity). */
export const Legend = ({ items }) => (
  <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
    {items.map((it) => (
      <li key={it.label} className="inline-flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: it.color }} aria-hidden="true" />
        {it.label}
      </li>
    ))}
  </ul>
);

/** Small dark tooltip that follows the hovered mark. x is the centre in px within the chart. */
export const Tooltip = ({ x, width, children }) => {
  const left = Math.min(Math.max(x, 70), Math.max(70, width - 70));
  return (
    <div
      className="pointer-events-none absolute top-0 -translate-x-1/2 -translate-y-1 z-10 rounded-lg bg-fg text-page px-2.5 py-1.5 text-xs shadow-raised whitespace-nowrap"
      style={{ left }}
      role="status"
    >
      {children}
    </div>
  );
};

/** Hidden table with the same numbers, for screen readers (the chart itself is aria-hidden). */
export const SrTable = ({ caption, columns, rows }) => (
  <table className="sr-only">
    <caption>{caption}</caption>
    <thead>
      <tr>
        {columns.map((c) => (
          <th key={c} scope="col">
            {c}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((r) => (
        <tr key={r[0]}>
          {r.map((cell, i) => (i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>))}
        </tr>
      ))}
    </tbody>
  </table>
);

export const ChartSkeleton = ({ height = 220 }) => <div className="animate-pulse bg-hover rounded-xl" style={{ height }} aria-hidden="true" />;

/** Bar / wave switch for a chart (a small segmented control with icons). */
export const ChartModeToggle = ({ mode, onChange, label = 'Chart style' }) => (
  <div className="flex items-center p-0.5 rounded-lg bg-sunken border border-line" role="radiogroup" aria-label={label}>
    {[
      { value: 'bar', text: 'Bars', Icon: ChartColumn },
      { value: 'wave', text: 'Wave', Icon: ChartSpline },
    ].map(({ value, text, Icon }) => (
      <button
        key={value}
        type="button"
        role="radio"
        aria-checked={mode === value}
        aria-label={text}
        title={text}
        onClick={() => onChange(value)}
        className={`grid place-items-center w-7 h-7 rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
          mode === value ? 'bg-surface text-accent-fg shadow-card' : 'text-subtle hover:text-fg'
        }`}
      >
        <Icon className="w-4 h-4" aria-hidden="true" />
      </button>
    ))}
  </div>
);

/** Small segmented control for a range such as 6M / 12M. */
export const RangeToggle = ({ value, options, onChange, label = 'Range' }) => (
  <div className="flex items-center p-0.5 rounded-lg bg-sunken border border-line" role="radiogroup" aria-label={label}>
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        role="radio"
        aria-checked={value === o.value}
        onClick={() => onChange(o.value)}
        className={`h-7 px-2 rounded-md text-xs font-medium tabular-nums transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
          value === o.value ? 'bg-surface text-fg shadow-card' : 'text-muted hover:text-fg'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);
