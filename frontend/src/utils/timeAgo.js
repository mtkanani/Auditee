/** "just now", "5m ago", "3h ago", "2d ago", then a short date. */
export const timeAgo = (date) => {
  const s = Math.max(0, Math.round((Date.now() - new Date(date)) / 1000));
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)}d ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};
