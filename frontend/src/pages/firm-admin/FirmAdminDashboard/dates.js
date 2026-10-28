// daysUntil / dueLabel are shared with other pages.
export { daysUntil, dueLabel } from '../../../utils/dueDate';

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
