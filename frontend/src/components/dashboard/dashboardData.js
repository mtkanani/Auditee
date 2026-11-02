// Plain helpers shared by the dashboards (kept out of component files for fast refresh).

export const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

export const todayLabel = () =>
  new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

/** Task status segments in the validated chart colours (see --chart-* in index.css). */
export const taskSegments = ({ pending = 0, inProgress = 0, completed = 0 }) => [
  { key: 'pending', label: 'Pending', value: pending, color: 'var(--chart-pending)' },
  { key: 'progress', label: 'In progress', value: inProgress, color: 'var(--chart-progress)' },
  { key: 'done', label: 'Completed', value: completed, color: 'var(--chart-done)' },
];

/** Open tasks first by due date (no date last). */
export const upNext = (tasks = [], limit = 5) =>
  tasks
    .filter((t) => t.status !== 'COMPLETED')
    .sort((a, b) => (a.dueDate ? new Date(a.dueDate) : Infinity) - (b.dueDate ? new Date(b.dueDate) : Infinity))
    .slice(0, limit);
