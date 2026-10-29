const DAY = 24 * 60 * 60 * 1000;
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Whole days from today to the given date (negative = in the past). */
export const daysUntil = (date) => Math.round((startOfDay(new Date(date)) - startOfDay(new Date())) / DAY);

/** Badge text and tone for a due date. */
export const dueLabel = (date) => {
  const d = daysUntil(date);
  if (d < 0) return { text: `Overdue ${-d} day${d === -1 ? '' : 's'}`, tone: 'danger' };
  if (d === 0) return { text: 'Due today', tone: 'danger' };
  if (d === 1) return { text: 'Due tomorrow', tone: 'warning' };
  return { text: `Due in ${d} days`, tone: d <= 7 ? 'warning' : 'neutral' };
};

export const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

export const todayLabel = () =>
  new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

/** ₹ amount in Indian short form: 4,21,500 -> ₹4.2L, 1,25,00,000 -> ₹1.3Cr. */
export const inrShort = (n = 0) => {
  const v = Number(n) || 0;
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(1).replace(/\.0$/, '')}Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(1).replace(/\.0$/, '')}L`;
  return `₹${v.toLocaleString('en-IN')}`;
};
