import React from 'react';
import { TrendChart } from './TrendChart';

const SERIES = [
  { key: 'billed', label: 'Billed', color: 'var(--chart-progress)' },
  { key: 'collected', label: 'Collected', color: 'var(--chart-done)' },
];

const monthDate = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1);
};

/** Billed vs collected per month, as bars or a wave. money: formats ₹ amounts. */
export const RevenueChart = ({ data, money, mode }) => (
  <TrendChart
    mode={mode}
    series={SERIES}
    format={money}
    caption="Billed and collected per month"
    labelEvery={data.length > 6 ? 2 : 1}
    points={data.map((d) => ({
      id: d.month,
      label: monthDate(d.month).toLocaleDateString('en-IN', { month: 'short' }),
      longLabel: monthDate(d.month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      values: { billed: d.billed, collected: d.collected },
    }))}
  />
);
