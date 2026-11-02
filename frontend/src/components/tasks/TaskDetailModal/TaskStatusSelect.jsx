import React from 'react';
import { Select } from '../../ui';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'UNDER_REVIEW', label: 'Under review' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const TaskStatusSelect = ({ task, handleStatusChange }) => (
  <div className="w-36">
    <Select
      aria-label="Task status"
      value={task?.status || 'PENDING'}
      onChange={(e) => handleStatusChange(e.target.value)}
      options={STATUS_OPTIONS}
      className="h-9"
    />
  </div>
);
