import React from 'react';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';

export const AdminPasswordFields = ({
  register,
  errors,
  passwordValue,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}) => (
    <>
      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id="firmAdmin.password"
          placeholder=" "
          className={`peer w-full pl-4 pr-11 py-3 bg-slate-950 border rounded-xl text-white placeholder-transparent text-sm focus:outline-none focus:border-brand-500 transition-colors ${
            errors.firmAdmin?.password ? 'border-rose-500' : 'border-slate-800'
          }`}
          {...register('firmAdmin.password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters long' },
            validate: {
              uppercase: (v) => /[A-Z]/.test(v) || 'Must contain at least one uppercase letter',
              lowercase: (v) => /[a-z]/.test(v) || 'Must contain at least one lowercase letter',
              number: (v) => /[0-9]/.test(v) || 'Must contain at least one number',
              special: (v) => /[^A-Za-z0-9]/.test(v) || 'Must contain at least one special character',
            },
          })}
        />
        <label
          htmlFor="firmAdmin.password"
          className="absolute left-4 top-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-brand-400"
        >
          Password <span className="text-rose-500">*</span>
        </label>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        {errors.firmAdmin?.password && (
          <span className="text-rose-500 text-xs mt-1 block flex items-center gap-1">
            <ShieldAlert size={12} /> {errors.firmAdmin.password.message}
          </span>
        )}
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          id="firmAdmin.confirmPassword"
          placeholder=" "
          className={`peer w-full pl-4 pr-11 py-3 bg-slate-950 border rounded-xl text-white placeholder-transparent text-sm focus:outline-none focus:border-brand-500 transition-colors ${
            errors.firmAdmin?.confirmPassword ? 'border-rose-500' : 'border-slate-800'
          }`}
          {...register('firmAdmin.confirmPassword', {
            required: 'Please confirm the password',
            validate: (val) => val === passwordValue || 'Passwords do not match',
          })}
        />
        <label
          htmlFor="firmAdmin.confirmPassword"
          className="absolute left-4 top-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-brand-400"
        >
          Confirm Password <span className="text-rose-500">*</span>
        </label>
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
        >
          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        {errors.firmAdmin?.confirmPassword && (
          <span className="text-rose-500 text-xs mt-1 block flex items-center gap-1">
            <ShieldAlert size={12} /> {errors.firmAdmin.confirmPassword.message}
          </span>
        )}
      </div>
    </>
);
