import React, { useEffect, useId, useState } from 'react';
import { Legend, SrTable, Tooltip } from './chartKit';
import { barPath, monotonePath, niceTicks, useWidth } from './chartMath';

const PAD = { top: 16, right: 10, bottom: 26, left: 52 };

/**
 * One chart, two looks: grouped bars or a smooth "wave" (lines with a soft gradient fill).
 * Switching mode animates: bars sink to the baseline in turn while the waves draw in from the left,
 * and back. Hovering shows a crosshair and every series' value for that point.
 *
 * points: [{ id, label, longLabel, values: { [seriesKey]: number }, muted? }]
 * series: [{ key, label, color }] in a fixed order (colours never depend on rank)
 * reference: optional { value, label } dashed line, e.g. team size
 */
export const TrendChart = ({ points, series, mode, format = String, height = 220, reference, labelEvery = 1, caption }) => {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  const [drawn, setDrawn] = useState(false);
  const gradientId = useId().replace(/:/g, '');

  // Start hidden, then reveal just after mounting so the first appearance animates too. A timer
  // rather than requestAnimationFrame, which browsers pause in background tabs.
  useEffect(() => {
    const id = setTimeout(() => setDrawn(true), 30);
    return () => clearTimeout(id);
  }, []);

  const max = Math.max(reference?.value || 0, ...points.flatMap((p) => series.map((s) => p.values[s.key] || 0)));
  const { top, ticks } = niceTicks(max, height < 200 ? 3 : 4);
  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = height - PAD.top - PAD.bottom;
  const band = points.length ? plotW / points.length : 0;
  const groupW = Math.min(band - Math.max(6, band * 0.3), series.length * 22);
  const barW = Math.max(3, (groupW - (series.length - 1) * 2) / series.length);
  const x = (i) => PAD.left + band * i + band / 2;
  const y = (v) => PAD.top + plotH - (v / top) * plotH;
  const baseline = PAD.top + plotH;

  const showBars = drawn && mode === 'bar';
  const showWave = drawn && mode === 'wave';
  const hovered = hover !== null ? points[hover] : null;

  return (
    <div className="space-y-3">
      {series.length > 1 && <Legend items={series} />}
      <div ref={ref} className="relative" onMouseLeave={() => setHover(null)}>
        {width > 0 && (
          <svg width={width} height={height} aria-hidden="true" className="block overflow-visible">
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`${gradientId}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity="0.32" />
                  <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                </linearGradient>
              ))}
              <clipPath id={`${gradientId}-reveal`}>
                <rect
                  x={PAD.left}
                  y={0}
                  width={plotW + PAD.right}
                  height={height}
                  className="chart-reveal"
                  style={{ transform: `scaleX(${showWave ? 1 : 0})`, transformOrigin: `${PAD.left}px 0` }}
                />
              </clipPath>
            </defs>

            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeDasharray={t ? '3 4' : undefined} />
                <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-[var(--subtle)] text-[11px] tabular-nums">
                  {format(t)}
                </text>
              </g>
            ))}

            {reference?.value > 0 && (
              <g>
                <line x1={PAD.left} x2={width - PAD.right} y1={y(reference.value)} y2={y(reference.value)} stroke="var(--muted)" strokeDasharray="5 4" strokeWidth={1.5} />
                <text x={width - PAD.right} y={y(reference.value) - 5} textAnchor="end" className="fill-[var(--muted)] text-[11px]">
                  {reference.label}
                </text>
              </g>
            )}

            {/* Bars: each scales from the baseline; staggered so they rise and sink in turn. */}
            {points.map((p, i) =>
              series.map((s, j) => {
                const v = p.values[s.key] || 0;
                const h = (v / top) * plotH;
                const bx = x(i) - groupW / 2 + j * (barW + 2);
                return (
                  <path
                    key={`${p.id}-${s.key}`}
                    d={barPath(bx, baseline - h, barW, h)}
                    fill={s.color}
                    fillOpacity={p.muted ? 0.45 : 1}
                    className="chart-bar"
                    style={{
                      transform: `scaleY(${showBars ? 1 : 0})`,
                      transformOrigin: `0 ${baseline}px`,
                      opacity: showBars ? (hover === null || hover === i ? 1 : 0.45) : 0,
                      transitionDelay: `${(showBars ? i : points.length - i) * 35}ms`,
                    }}
                  />
                );
              })
            )}

            {/* Waves: area + line per series, revealed left to right by the clip. */}
            <g clipPath={`url(#${gradientId}-reveal)`} className="chart-wave" style={{ opacity: showWave ? 1 : 0 }}>
              {series.map((s) => {
                const pts = points.map((p, i) => [x(i), y(p.values[s.key] || 0)]);
                const line = monotonePath(pts);
                const area = pts.length ? `${line} L${pts[pts.length - 1][0]},${baseline} L${pts[0][0]},${baseline} Z` : '';
                return (
                  <g key={s.key}>
                    <path d={area} fill={`url(#${gradientId}-${s.key})`} />
                    <path d={line} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                  </g>
                );
              })}
            </g>

            {/* Crosshair + markers for the hovered point (both modes). */}
            {hovered && (
              <g pointerEvents="none">
                <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={baseline} stroke="var(--line-strong)" />
                {mode === 'wave' &&
                  series.map((s) => (
                    <circle key={s.key} cx={x(hover)} cy={y(hovered.values[s.key] || 0)} r={4.5} fill={s.color} stroke="var(--surface)" strokeWidth={2} />
                  ))}
              </g>
            )}

            {points.map((p, i) => {
              const last = i === points.length - 1;
              return (
                <g key={p.id}>
                  {(last || i % labelEvery === 0) && (
                    <text x={x(i)} y={height - 6} textAnchor="middle" className={`text-[11px] ${last ? 'fill-[var(--fg)] font-medium' : 'fill-[var(--muted)]'}`}>
                      {p.label}
                    </text>
                  )}
                  {/* Hit area: the whole column, bigger than any mark */}
                  <rect x={x(i) - band / 2} y={PAD.top} width={band} height={plotH} fill="transparent" onMouseEnter={() => setHover(i)} />
                </g>
              );
            })}
          </svg>
        )}
        {hovered && (
          <Tooltip x={x(hover)} width={width}>
            <p className="font-medium">{hovered.longLabel}</p>
            {series.map((s) => (
              <p key={s.key} className="flex items-center gap-1.5 tabular-nums">
                <span className="w-2 h-2 rounded-sm" style={{ background: s.color }} aria-hidden="true" />
                {s.label} {format(hovered.values[s.key] || 0)}
                {reference && s.key === series[0].key ? ` of ${reference.value}` : ''}
              </p>
            ))}
          </Tooltip>
        )}
      </div>
      <SrTable
        caption={caption}
        columns={['', ...series.map((s) => s.label)]}
        rows={points.map((p) => [p.longLabel, ...series.map((s) => format(p.values[s.key] || 0))])}
      />
    </div>
  );
};
