import React from 'react';

export const StepTracker = ({ step }) => (
  <div className="flex items-center justify-between mb-8 px-4">
    {[1, 2, 3].map((num) => (
      <React.Fragment key={num}>
        <div className="flex flex-col items-center">
          <div 
            className={`
                  w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-300
                  ${step === num 
                ? 'bg-brand-500 text-white shadow-glow-indigo/50 border border-brand-400' 
                : step > num 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                  : 'bg-slate-900 text-slate-500 border border-slate-800'}
                `}
          >
            {step > num ? '✓' : num}
          </div>
        </div>
        {num < 3 && (
          <div 
            className={`
                  flex-1 h-0.5 mx-2 rounded transition-all duration-300
                  ${step > num ? 'bg-emerald-500/40' : 'bg-slate-800'}
                `}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);
