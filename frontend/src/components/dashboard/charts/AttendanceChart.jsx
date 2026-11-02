import React, { useState } from 'react';
import { SrTable, Tooltip } from './chartKit';
import { barPath, niceTicks, useWidth } from './chartMath';

const HEIGHT = 180;
const PAD = { top: 14, right: 8, bottom: 24, left: 32 };

const dayDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const fmt = (iso, opts) => dayDate(iso).toLocaleDateString('en-IN', opts);

/**
 * People checked in per day (one series, so no legend), with a dashed line at team size.
 * Weekends are drawn lighter; today is labelled.
 */
export const AttendanceChart = ({ days, team }) => {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  const max = Math.max(team, ...days.map((d) => d.checkedIn));
  const { top, ticks } = niceTicks(max, 3);

  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const band = days.length ? plotW / days.length : 0;
  const barW = Math.max(4, Math.min(20, band - 6));
  const y = (v) => PAD.top + plotH - (v / top) * plotH;
  const hovered = hover !== null ? days[hover] : null;

  return (
    <div>
      <div ref={ref} className="relative" onMouseLeave={() => setHover(null)}>
        {width > 0 && (
          <svg width={width} height={HEIGHT} aria-hidden="true" className="block overflow-visible">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeDasharray={t ? '3 4' : undefined} />
                <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-[var(--subtle)] text-[11px] tabular-nums">
                  {t}
                </text>
              </g>
            ))}
            {team > 0 && (
              <g>
                <line x1={PAD.left} x2={width - PAD.right} y1={y(team)} y2={y(team)} stroke="var(--muted)" strokeDasharray="5 4" strokeWidth={1.5} />
                <text x={width - PAD.right} y={y(team) - 5} textAnchor="end" className="fill-[var(--muted)] text-[11px]">
                  Team of {team}
                </text>
              </g>
            )}
            {days.map((d, i) => {
              const cx = PAD.left + band * i + band / 2;
              const h = (d.checkedIn / top) * plotH;
              const weekday = dayDate(d.day).getDay();
              const weekend = weekday === 0 || weekday === 6;
              const last = i === days.length - 1;
              const showLabel = last || i % 3 === 0;
              return (
                <g key={d.day} opacity={hover === null || hover === i ? 1 : 0.45} className="transition-opacity">
                  <path
                    d={barPath(cx - barW / 2, PAD.top + plotH - h, barW, h)}
                    fill="var(--chart-progress)"
                    fillOpacity={weekend ? 0.45 : 1}
                    className="grow-y"
                    style={{ '--i': i * 0.4, transformOrigin: `0 ${PAD.top + plotH}px` }}
                  />
                  {showLabel && (
                    <text x={cx} y={HEIGHT - 6} textAnchor="middle" className={`text-[11px] ${last ? 'fill-[var(--fg)] font-medium' : 'fill-[var(--muted)]'}`}>
                      {last ? 'Today' : fmt(d.day, { day: 'numeric', month: 'short' })}
                    </text>
                  )}
                  <rect x={cx - band / 2} y={PAD.top} width={band} height={plotH} fill="transparent" onMouseEnter={() => setHover(i)} />
                </g>
              );
            })}
          </svg>
        )}
        {hovered && (
          <Tooltip x={PAD.left + band * hover + band / 2} width={width}>
            <p className="font-medium">{fmt(hovered.day, { weekday: 'short', day: 'numeric', month: 'short' })}</p>
            <p className="tabular-nums">
              {hovered.checkedIn} of {team} checked in
            </p>
          </Tooltip>
        )}
      </div>
      <SrTable
        caption="People checked in per day"
        columns={['Day', 'Checked in']}
        rows={days.map((d) => [fmt(d.day, { weekday: 'short', day: 'numeric', month: 'short' }), `${d.checkedIn} of ${team}`])}
      />
    </div>
  );
};
