import React, { useState } from 'react';
import { Legend, SrTable, Tooltip } from './chartKit';
import { barPath, niceTicks, useWidth } from './chartMath';

const SERIES = [
  { key: 'billed', label: 'Billed', color: 'var(--chart-progress)' },
  { key: 'collected', label: 'Collected', color: 'var(--chart-done)' },
];
const HEIGHT = 220;
const PAD = { top: 16, right: 8, bottom: 26, left: 52 };

const monthLabel = (ym, style = 'short') => {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: style, ...(style === 'long' ? { year: 'numeric' } : {}) });
};

/**
 * Billed vs collected per month: grouped columns (two series, fixed colour order), quiet grid, a
 * legend, and a tooltip per month. money: formats ₹ amounts.
 */
export const RevenueChart = ({ data, money }) => {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  const max = Math.max(0, ...data.flatMap((d) => [d.billed, d.collected]));
  const { top, ticks } = niceTicks(max);

  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const band = data.length ? plotW / data.length : 0;
  const barW = Math.max(6, Math.min(22, (band - 18) / 2));
  const y = (v) => PAD.top + plotH - (v / top) * plotH;
  const hovered = hover !== null ? data[hover] : null;

  return (
    <div className="space-y-3">
      <Legend items={SERIES} />
      <div ref={ref} className="relative" onMouseLeave={() => setHover(null)}>
        {width > 0 && (
          <svg width={width} height={HEIGHT} aria-hidden="true" className="block overflow-visible">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeDasharray={t ? '3 4' : undefined} />
                <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-[var(--subtle)] text-[11px] tabular-nums">
                  {money(t)}
                </text>
              </g>
            ))}
            {data.map((d, i) => {
              const cx = PAD.left + band * i + band / 2;
              return (
                <g key={d.month} opacity={hover === null || hover === i ? 1 : 0.45} className="transition-opacity">
                  {SERIES.map((s, j) => {
                    const h = (d[s.key] / top) * plotH;
                    const x = cx - barW - 1 + j * (barW + 2);
                    return (
                      <path
                        key={s.key}
                        d={barPath(x, PAD.top + plotH - h, barW, h)}
                        fill={s.color}
                        className="grow-y"
                        style={{ '--i': i, transformOrigin: `0 ${PAD.top + plotH}px` }}
                      />
                    );
                  })}
                  <text x={cx} y={HEIGHT - 6} textAnchor="middle" className="fill-[var(--muted)] text-[11px]">
                    {monthLabel(d.month)}
                  </text>
                  {/* Hit area wider than the bars */}
                  <rect x={cx - band / 2} y={PAD.top} width={band} height={plotH} fill="transparent" onMouseEnter={() => setHover(i)} />
                </g>
              );
            })}
          </svg>
        )}
        {hovered && (
          <Tooltip x={PAD.left + band * hover + band / 2} width={width}>
            <p className="font-medium">{monthLabel(hovered.month, 'long')}</p>
            <p>Billed {money(hovered.billed)}</p>
            <p>Collected {money(hovered.collected)}</p>
          </Tooltip>
        )}
      </div>
      <SrTable
        caption="Billed and collected per month"
        columns={['Month', 'Billed', 'Collected']}
        rows={data.map((d) => [monthLabel(d.month, 'long'), money(d.billed), money(d.collected)])}
      />
    </div>
  );
};
