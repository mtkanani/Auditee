import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-height-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Header Logo */}
      <div className="flex flex-col items-center mb-8 animate-fade-in">
        <img src="/auditee logo.svg" alt="Auditee Logo" className="h-10 w-auto mb-2.5 object-contain" />
        <p className="text-slate-500 text-[10px] tracking-widest uppercase font-bold">Enterprise Auth System</p>
      </div>

      {/* Main Glassmorphic Form Card */}
      <div className="w-full max-w-md glow-card-container animate-slide-up">
        <div className="glass-panel p-8 rounded-2xl shadow-glass-lg">
          {(title || subtitle) && (
            <div className="mb-6 text-center">
              {title && (
                <h2 className="text-2xl font-bold font-sans text-white tracking-tight">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-slate-400 mt-2 font-medium">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          
          {children}
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="mt-8 text-xs text-slate-500 tracking-wide font-medium animate-fade-in">
        &copy; {new Date().getFullYear()} Auditee. All rights reserved.
      </div>
    </div>
  );
};

export default AuthLayout;
