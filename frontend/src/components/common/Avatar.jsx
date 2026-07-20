import React from 'react';
import { getInitials } from '../../utils/helpers';

export const Avatar = ({ firstName = '', lastName = '', src, size = 'md', className = '' }) => {
  const initials = getInitials(firstName, lastName);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  }[size] || 'w-10 h-10 text-sm';

  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName} ${lastName}`}
        className={`${sizeClasses} rounded-full object-cover ring-2 ring-indigo-500/30 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20 ring-2 ring-white/10 ${className}`}
    >
      {initials}
    </div>
  );
};
