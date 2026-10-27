import React from 'react';

export const TaskStatusSelect = ({ task, handleStatusChange }) => (
  <select
    value={task?.status || 'PENDING'}
    onChange={(e) => handleStatusChange(e.target.value)}
    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-100 focus:outline-none focus:border-indigo-500"
  >
    <option value="PENDING">PENDING</option>
    <option value="IN_PROGRESS">IN PROGRESS</option>
    <option value="UNDER_REVIEW">UNDER REVIEW</option>
    <option value="COMPLETED">COMPLETED</option>
    <option value="CANCELLED">CANCELLED</option>
  </select>
);
