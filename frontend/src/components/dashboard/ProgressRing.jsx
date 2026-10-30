import React from 'react';

/** Single headline percentage as a ring. value/total are counts; shows "—" when total is 0. */
export const ProgressRing = ({ value = 0, total = 0, label, caption, size = 128, color = 'var(--chart-done)' }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : null;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = pct === null ? 0 : (c * pct) / 100;

  return (
    <figure className="flex items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={pct === null ? `${label}: nothing yet` : `${label}: ${pct}% (${value} of ${total})`}
          className="-rotate-90"
        >
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
          {pct !== null && pct > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c}`}
              className="transition-[stroke-dasharray] duration-700 ease-out"
            />
          )}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center" aria-hidden="true">
          <div>
            <p className="text-2xl font-semibold tabular-nums text-fg leading-none">{pct === null ? '—' : `${pct}%`}</p>
            <p className="text-[11px] text-subtle mt-1">{label}</p>
          </div>
        </div>
      </div>
      {caption && <figcaption className="text-sm text-muted max-w-[11rem]">{caption}</figcaption>}
    </figure>
  );
};
