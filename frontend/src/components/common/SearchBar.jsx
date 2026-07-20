import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <FiSearch className="absolute left-3.5 text-slate-400 w-4 h-4" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 text-slate-500 hover:text-slate-300 p-0.5 rounded-full hover:bg-slate-800"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
