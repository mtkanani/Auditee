// daysUntil / dueLabel are shared with other pages.
export { daysUntil, dueLabel } from '../../../utils/dueDate';

/** ₹ amount in Indian short form: 4,21,500 -> ₹4.2L, 1,25,00,000 -> ₹1.3Cr. */
export const inrShort = (n = 0) => {
  const v = Number(n) || 0;
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(1).replace(/\.0$/, '')}Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(1).replace(/\.0$/, '')}L`;
  return `₹${v.toLocaleString('en-IN')}`;
};
