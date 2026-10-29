export const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export const longDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
