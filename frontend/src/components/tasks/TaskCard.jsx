import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiPaperclip, FiUser } from 'react-icons/fi';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/helpers';

export const TaskCard = ({ task, onClick, onStatusChange }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={() => onClick && onClick(task)}
      className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 shadow-lg cursor-pointer transition-all duration-200 space-y-3 group"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2">
          {task.title || task.name}
        </h4>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400">
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <FiClock className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}

        {task.client && (
          <div className="flex items-center gap-1 font-medium text-slate-300">
            <FiUser className="w-3.5 h-3.5 text-indigo-400" />
            <span className="truncate max-w-[100px]">{task.client.clientName}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <StatusBadge status={task.status} />

        {onStatusChange && (
          <select
            onClick={(e) => e.stopPropagation()}
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="text-[11px] bg-slate-950 border border-slate-800 rounded-md px-1.5 py-0.5 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        )}
      </div>
    </motion.div>
  );
};
