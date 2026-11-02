import React from 'react';
import { TrendChart } from './TrendChart';

const SERIES = [{ key: 'checkedIn', label: 'Checked in', color: 'var(--chart-progress)' }];

const dayDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/** People checked in per day, as bars or a wave, with a dashed line at team size. Weekends are lighter. */
export const AttendanceChart = ({ days, team, mode }) => (
  <TrendChart
    mode={mode}
    series={SERIES}
    height={190}
    labelEvery={3}
    caption="People checked in per day"
    reference={team > 0 ? { value: team, label: `Team of ${team}` } : undefined}
    points={days.map((d, i) => {
      const date = dayDate(d.day);
      const last = i === days.length - 1;
      return {
        id: d.day,
        label: last ? 'Today' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        longLabel: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
        values: { checkedIn: d.checkedIn },
        muted: [0, 6].includes(date.getDay()),
      };
    })}
  />
);
