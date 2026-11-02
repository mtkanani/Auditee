const TYPE_LABELS = { CASUAL_LEAVE: 'Casual', SICK_LEAVE: 'Sick', EARNED_LEAVE: 'Earned' };

export const leaveTypeLabel = (type = '') =>
  TYPE_LABELS[type] || type.toLowerCase().replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

const short = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

/** "3 Nov" for one day, "3 Nov – 5 Nov 2026" for a range. */
export const dateRange = (start, end) => {
  const year = new Date(end || start).getFullYear();
  if (!end || new Date(start).toDateString() === new Date(end).toDateString()) return `${short(start)} ${year}`;
  return `${short(start)} – ${short(end)} ${year}`;
};

export const daysLabel = (n) => `${n} day${Number(n) === 1 ? '' : 's'}`;
