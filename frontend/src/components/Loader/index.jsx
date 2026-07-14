import React from 'react';

const Loader = ({ fullScreen = true, message = 'Loading...' }) => {
  return (
    <div 
      className={`
        flex flex-col items-center justify-center gap-4 z-50
        ${fullScreen ? 'fixed inset-0 bg-slate-950/80 backdrop-blur-md' : 'w-full h-64'}
      `}
    >
      <div className="relative flex items-center justify-center">
        {/* Glow Ring */}
        <div className="w-16 h-16 rounded-full border-4 border-brand-500/10 border-t-brand-500 animate-spin"></div>
        {/* Inner Pulse */}
        <div className="absolute w-8 h-8 rounded-full bg-indigo-500/30 animate-ping"></div>
        {/* Core Dot */}
        <div className="absolute w-4 h-4 rounded-full bg-brand-500 shadow-glow-indigo"></div>
      </div>
      
      {message && (
        <p className="text-sm font-medium tracking-wider text-slate-300 animate-pulse-slow">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
