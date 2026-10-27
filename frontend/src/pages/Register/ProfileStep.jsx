import React from 'react';
import { ChevronDown, Lock, MapPin, Phone, User } from 'lucide-react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

export const ProfileStep = ({ errors, register, passwordValue, submitting }) => (
  <div className="animate-fade-in space-y-4 max-h-[350px] overflow-y-auto pr-1">
    <div className="grid grid-cols-2 gap-3">
      <InputField
        label="First Name"
        name="firstName"
        placeholder="John"
        icon={User}
        error={errors.firstName}
        {...register('firstName', {
          required: 'First name is required',
          minLength: { value: 2, message: 'Min 2 characters' },
          maxLength: { value: 50, message: 'Max 50 characters' },
        })}
      />
              
      <InputField
        label="Last Name"
        name="lastName"
        placeholder="Doe"
        icon={User}
        error={errors.lastName}
        {...register('lastName', {
          required: 'Last name is required',
          minLength: { value: 2, message: 'Min 2 characters' },
          maxLength: { value: 50, message: 'Max 50 characters' },
        })}
      />
    </div>

    <InputField
      label="Mobile Number"
      name="mobileNumber"
      type="tel"
      placeholder="10-digit number"
      icon={Phone}
      maxLength={10}
      error={errors.mobileNumber}
      {...register('mobileNumber', {
        required: 'Mobile number is required',
        pattern: {
          value: /^[0-9]{10}$/,
          message: 'Must be exactly 10 digits',
        },
      })}
    />

    <div className="grid grid-cols-2 gap-3">
      <InputField
        label="City"
        name="city"
        placeholder="Enter your city"
        icon={MapPin}
        error={errors.city}
        {...register('city', {
          required: 'City is required',
          maxLength: { value: 100, message: 'Max 100 characters' },
        })}
      />

      {/* Role Selector */}
      <div className="w-full mb-4.5">
        <label 
          htmlFor="role" 
          className="block text-sm font-medium text-slate-300 mb-1.5 tracking-wide"
        >
          Role
        </label>
        <div className="relative rounded-xl shadow-sm">
          <select
            id="role"
            className={`
                      w-full py-3 px-4 text-sm rounded-xl transition-all duration-200 glass-input border focus:outline-none appearance-none cursor-pointer
                      ${errors.role ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-brand-500'}
                    `}
            {...register('role', { required: 'Role is required' })}
          >
            <option value="user" className="bg-slate-900 text-slate-100">User</option>
            <option value="admin" className="bg-slate-900 text-slate-100">Admin</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
            <ChevronDown size={18} />
          </div>
        </div>
        {errors.role && (
          <p className="mt-1.5 text-xs text-rose-500 font-medium tracking-wide flex items-center gap-1 animate-fade-in">
            <span className="inline-block w-1 h-1 rounded-full bg-rose-500"></span>
            {errors.role.message}
          </p>
        )}
      </div>
    </div>

    <InputField
      label="Password"
      name="password"
      type="password"
      placeholder="••••••••"
      icon={Lock}
      error={errors.password}
      {...register('password', {
        required: 'Password is required',
        minLength: { value: 8, message: 'Password must be at least 8 characters' },
        validate: {
          hasUpper: (val) => /[A-Z]/.test(val) || 'Must contain at least 1 uppercase letter',
          hasLower: (val) => /[a-z]/.test(val) || 'Must contain at least 1 lowercase letter',
          hasNumber: (val) => /[0-9]/.test(val) || 'Must contain at least 1 number',
          hasSpecial: (val) => /[^A-Za-z0-9]/.test(val) || 'Must contain at least 1 special character',
        },
      })}
    />

    <InputField
      label="Confirm Password"
      name="confirmPassword"
      type="password"
      placeholder="••••••••"
      icon={Lock}
      error={errors.confirmPassword}
      {...register('confirmPassword', {
        required: 'Confirm password is required',
        validate: (val) => val === passwordValue || 'Passwords do not match',
      })}
    />

    {/* Final Step Information Verification Checkbox */}
    <div className="w-full mt-3.5 mb-1.5">
      <label className="flex items-start gap-3 cursor-pointer select-none group">
        <input
          type="checkbox"
          className="w-4 h-4 mt-0.5 rounded border-slate-800 bg-slate-900/60 text-brand-500 focus:ring-brand-500/20 focus:ring-offset-0 focus:outline-none transition-all cursor-pointer accent-brand-500"
          {...register('confirmDetails', {
            required: 'Verification check is required to register.',
          })}
        />
        <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed">
          I confirm that all the details provided above are accurate and true.
        </span>
      </label>
      {errors.confirmDetails && (
        <p className="mt-1.5 text-xs text-rose-500 font-medium tracking-wide flex items-center gap-1 animate-fade-in">
          <span className="inline-block w-1 h-1 rounded-full bg-rose-500"></span>
          {errors.confirmDetails.message}
        </p>
      )}
    </div>

    <Button
      type="submit"
      loading={submitting}
      className="mt-5"
    >
      Complete Registration
    </Button>
  </div>
);
