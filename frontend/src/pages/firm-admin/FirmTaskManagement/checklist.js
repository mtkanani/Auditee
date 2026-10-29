/** "2/5" checklist progress for a task (subtasks may be absent; _count is the server fallback). */
export const checklist = (t) => {
  const total = t.subtasks?.length || t._count?.subtasks || 0;
  const done = t.subtasks?.filter((s) => s.isCompleted)?.length || 0;
  return { done, total };
};
