import React from 'react';

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
