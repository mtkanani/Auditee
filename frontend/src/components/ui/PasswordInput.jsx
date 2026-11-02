import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from './Field';

/** Password field with a show/hide button. Takes the same props as Input (works with react-hook-form's register). */
export const PasswordInput = ({ icon = Lock, className, ...props }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input {...props} icon={icon} type={visible ? 'text' : 'password'} className={`pr-11 ${className || ''}`} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-lg text-subtle hover:text-fg hover:bg-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        {visible ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
      </button>
    </div>
  );
};
