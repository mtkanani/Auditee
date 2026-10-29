import React from 'react';
import { StatusTag } from '../ui/Badge';

/** Older status badge API, drawn with the kit StatusTag ("IN_PROGRESS" shows as "In progress"). */
export const StatusBadge = ({ status }) => {
  if (!status) return null;
  return <StatusTag status={String(status).toUpperCase()} />;
};
