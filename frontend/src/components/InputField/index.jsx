import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = React.forwardRef(({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  icon: Icon,
  disabled = false,
  ...rest
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full mb-4.5">
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-slate-300 mb-1.5 tracking-wide"
        >
          {label}
        </label>
      )}
      
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon size={18} />
          </div>
        )}
        
        <input
          id={name}
          name={name}
          type={inputType}
          ref={ref}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full py-3 text-sm rounded-xl transition-all duration-200
            ${Icon ? 'pl-11' : 'px-4'}
            ${isPassword ? 'pr-11' : 'pr-4'}
            ${disabled ? 'bg-slate-900/20 text-slate-500 border-slate-800/40 cursor-not-allowed' : 'glass-input'}
            ${error ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20' : 'border-slate-800 focus:border-brand-500'}
          `}
          {...rest}
        />
        
        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
          >
            {showPassword ? (
              <EyeOff size={18} className="animate-fade-in" />
            ) : (
              <Eye size={18} className="animate-fade-in" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1.5 text-xs text-rose-500 font-medium tracking-wide flex items-center gap-1 animate-fade-in">
          <span className="inline-block w-1 h-1 rounded-full bg-rose-500"></span>
          {error.message}
        </p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
