const DAY = 24 * 60 * 60 * 1000;
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Whole days from today to the given date (negative = in the past). */
export const daysUntil = (date) => Math.round((startOfDay(new Date(date)) - startOfDay(new Date())) / DAY);

/** Badge text and tone for a due date, e.g. { text: 'Due in 2 days', tone: 'warning' }. */
export const dueLabel = (date) => {
  const d = daysUntil(date);
  if (d < 0) return { text: `Overdue ${-d} day${d === -1 ? '' : 's'}`, tone: 'danger' };
  if (d === 0) return { text: 'Due today', tone: 'danger' };
  if (d === 1) return { text: 'Due tomorrow', tone: 'warning' };
  return { text: `Due in ${d} days`, tone: d <= 7 ? 'warning' : 'neutral' };
};
