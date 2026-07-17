import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Building2, UserCheck, ShieldAlert } from 'lucide-react';

const FirmForm = ({ onSubmit, defaultValues = null, isEdit = false, onCancel }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaultValues || {
      firm: {
        firmName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
      },
      firmAdmin: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      },
    },
    mode: 'onChange',
  });

  const passwordValue = watch('firmAdmin.password');

  const onFormSubmit = async (data) => {
    // Flatten / clean data structure as expected by API
    const firmData = {
      firmName: data.firm.firmName,
      email: data.firm.email,
      phone: data.firm.phone,
      address: data.firm.address || undefined,
      city: data.firm.city || undefined,
      state: data.firm.state || undefined,
      country: data.firm.country || undefined,
      pincode: data.firm.pincode || undefined,
    };

    const adminData = {
      firstName: data.firmAdmin.firstName,
      lastName: data.firmAdmin.lastName,
      email: data.firmAdmin.email,
      phone: data.firmAdmin.phone,
      ...(isEdit ? {} : { password: data.firmAdmin.password }),
    };

    await onSubmit(firmData, adminData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      
      {/* ── SECTION 1: Firm Details ── */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
        <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2 pb-3 border-b border-slate-800/80">
          <Building2 size={18} className="text-brand-400" />
          Section 1: Firm Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          {/* Firm Name */}
          <div className="relative">
            <input
              type="text"
              id="firm.firmName"
              placeholder=" "
              className={`peer w-full px-4 py-3 bg-slate-950 border rounded-xl text-white placeholder-transparent text-sm focus:outline-none focus:border-brand-500 transition-colors ${
                errors.firm?.firmName ? 'border-rose-500' : 'border-slate-800'
              }`}
              {...register('firm.firmName', {
                required: 'Firm name is required',
                minLength: { value: 2, message: 'Must be at least 2 characters' },
                maxLength: { value: 100, message: 'Must not exceed 100 characters' },
              })}
            />
            <label
              htmlFor="firm.firmName"
              className="absolute left-4 top-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-brand-400"
            >
              Firm Name <span className="text-rose-500">*</span>
            </label>
            {errors.firm?.firmName && (
              <span className="text-rose-500 text-xs mt-1 block flex items-center gap-1">
                <ShieldAlert size={12} /> {errors.firm.firmName.message}
              </span>
            )}
          </div>

          {/* Firm Email */}
          <div className="relative">
            <input
              type="email"
              id="firm.email"
              placeholder=" "
              className={`peer w-full px-4 py-3 bg-slate-950 border rounded-xl text-white placeholder-transparent text-sm focus:outline-none focus:border-brand-500 transition-colors ${
                errors.firm?.email ? 'border-rose-500' : 'border-slate-800'
              }`}
              {...register('firm.email', {
                required: 'Firm email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
              })}
            />
            <label
              htmlFor="firm.email"
              className="absolute left-4 top-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-brand-400"
            >
              Firm Email <span className="text-rose-500">*</span>
            </label>
            {errors.firm?.email && (
              <span className="text-rose-500 text-xs mt-1 block flex items-center gap-1">
                <ShieldAlert size={12} /> {errors.firm.email.message}
              </span>
            )}
          </div>

          {/* Firm Phone */}
          <div className="relative">
            <input
              type="text"
              id="firm.phone"
              placeholder=" "
              className={`peer w-full px-4 py-3 bg-slate-950 border rounded-xl text-white placeholder-transparent text-sm focus:outline-none focus:border-brand-500 transition-colors ${
                errors.firm?.phone ? 'border-rose-500' : 'border-slate-800'
              }`}
              {...register('firm.phone', {
                required: 'Firm phone is required',
                minLength: { value: 10, message: 'Must be at least 10 digits' },
                maxLength: { value: 15, message: 'Must not exceed 15 digits' },
              })}
            />
            <label
              htmlFor="firm.phone"
              className="absolute left-4 top-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-brand-400"
            >
              Firm Phone <span className="text-rose-500">*</span>
            </label>
            {errors.firm?.phone && (
              <span className="text-rose-500 text-xs mt-1 block flex items-center gap-1">
                <ShieldAlert size={12} /> {errors.firm.phone.message}
              </span>
            )}
          </div>

          {/* Pin code */}
          <div className="relative">
            <input
              type="text"
              id="firm.pincode"
              placeholder=" "
              className="peer w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-transparent text-sm focus:outline-none focus:border-brand-500 transition-colors"
              {...register('firm.pincode', {
                maxLength: { value: 10, message: 'Must not exceed 10 characters' },
              })}
            />
            <label
              htmlFor="firm.pincode"
              className="absolute left-4 top-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-brand-400"
            >
              Pincode
            </label>
          </div>

          {/* Address */}
          <div className="relative md:col-span-2">
            <input
              type="text"
              id="firm.address"
              placeholder=" "
              className="peer w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-transparent text-sm focus:outline-none focus:border-brand-500 transition-colors"
              {...register('firm.address', {
                maxLength: { value: 255, message: 'Must not exceed 255 characters' },
              })}
            />
            <label
              htmlFor="firm.address"
              className="absolute left-4 top-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-brand-400"
            >
              Address
            </label>
          </div>

          {/* City */}
          <div className="relative">
            <input
              type="text"
              id="firm.city"
              placeholder=" "
              className="peer w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-transparent text-sm focus:outline-none focus:border-brand-500 transition-colors"
              {...register('firm.city')}
            />
            <label
              htmlFor="firm.city"
              className="absolute left-4 top-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-brand-400"
            >
              City
            </label>
          </div>

          {/* State */}
          <div className="relative">
            <input
              type="text"
              id="firm.state"
              placeholder=" "
              className="peer w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-transparent text-sm focus:outline-none focus:border-brand-500 transition-colors"
              {...register('firm.state')}
            />
            <label
              htmlFor="firm.state"
              className="absolute left-4 top-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-brand-400"
            >
              State
            </label>
          </div>

          {/* Country */}
          <div className="relative md:col-span-2">
            <input
              type="text"
              id="firm.country"
              placeholder=" "
              className="peer w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-transparent text-sm focus:outline-none focus:border-brand-500 transition-colors"
              {...register('firm.country')}
            />
            <label
              htmlFor="firm.country"
              className="absolute left-4 top-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-brand-400"
            >
              Country
            </label>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: Firm Admin Details ── */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
        <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2 pb-3 border-b border-slate-800/80">
          <UserCheck size={18} className="text-brand-400" />
          Section 2: Firm Admin Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          {/* Admin First Name */}
          <div className="relative">
            <input
              type="text"
              id="firmAdmin.firstName"
              placeholder=" "
              className={`peer w-full px-4 py-3 bg-slate-950 border rounded-xl text-white placeholder-transparent text-sm focus:outline-none focus:border-brand-500 transition-colors ${
                errors.firmAdmin?.firstName ? 'border-rose-500' : 'border-slate-800'
              }`}
              {...register('firmAdmin.firstName', {
                required: 'First name is required',
                minLength: { value: 2, message: 'Must be at least 2 characters' },
              })}
            />
            <label
              htmlFor="firmAdmin.firstName"
              className="absolute left-4 top-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-brand-400"
            >
              First Name <span className="text-rose-500">*</span>
            </label>
            {errors.firmAdmin?.firstName && (
              <span className="text-rose-500 text-xs mt-1 block flex items-center gap-1">
                <ShieldAlert size={12} /> {errors.firmAdmin.firstName.message}
              </span>
            )}
          </div>

          {/* Admin Last Name */}
          <div className="relative">
            <input
              type="text"
              id="firmAdmin.lastName"
              placeholder=" "
              className={`peer w-full px-4 py-3 bg-slate-950 border rounded-xl text-white placeholder-transparent text-sm focus:outline-none focus:border-brand-500 transition-colors ${
                errors.firmAdmin?.lastName ? 'border-rose-500' : 'border-slate-800'
              }`}
              {...register('firmAdmin.lastName', {
                required: 'Last name is required',
                minLength: { value: 2, message: 'Must be at least 2 characters' },
              })}
            />
            <label
              htmlFor="firmAdmin.lastName"
              className="absolute left-4 top-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-brand-400"
            >
              Last Name <span className="text-rose-500">*</span>
            </label>
            {errors.firmAdmin?.lastName && (
              <span className="text-rose-500 text-xs mt-1 block flex items-center gap-1">
                <ShieldAlert size={12} /> {errors.firmAdmin.lastName.message}
              </span>
            )}
          </div>

          {/* Admin Email */}
          <div className="relative">
            <input
              type="email"
              id="firmAdmin.email"
              placeholder=" "
              className={`peer w-full px-4 py-3 bg-slate-950 border rounded-xl text-white placeholder-transparent text-sm focus:outline-none focus:border-brand-500 transition-colors ${
                errors.firmAdmin?.email ? 'border-rose-500' : 'border-slate-800'
              }`}
              {...register('firmAdmin.email', {
                required: 'Admin email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
              })}
            />
            <label
              htmlFor="firmAdmin.email"
              className="absolute left-4 top-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-brand-400"
            >
              Admin Email <span className="text-rose-500">*</span>
            </label>
            {errors.firmAdmin?.email && (
              <span className="text-rose-500 text-xs mt-1 block flex items-center gap-1">
                <ShieldAlert size={12} /> {errors.firmAdmin.email.message}
              </span>
            )}
          </div>

          {/* Admin Phone */}
          <div className="relative">
            <input
              type="text"
              id="firmAdmin.phone"
              placeholder=" "
              className={`peer w-full px-4 py-3 bg-slate-950 border rounded-xl text-white placeholder-transparent text-sm focus:outline-none focus:border-brand-500 transition-colors ${
                errors.firmAdmin?.phone ? 'border-rose-500' : 'border-slate-800'
              }`}
              {...register('firmAdmin.phone', {
                required: 'Admin phone is required',
                minLength: { value: 10, message: 'Must be at least 10 digits' },
                maxLength: { value: 15, message: 'Must not exceed 15 digits' },
              })}
            />
            <label
              htmlFor="firmAdmin.phone"
              className="absolute left-4 top-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-brand-400"
            >
              Admin Phone <span className="text-rose-500">*</span>
            </label>
            {errors.firmAdmin?.phone && (
              <span className="text-rose-500 text-xs mt-1 block flex items-center gap-1">
                <ShieldAlert size={12} /> {errors.firmAdmin.phone.message}
              </span>
            )}
          </div>

          {/* Password (Only if creating) */}
          {!isEdit && (
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
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3.5 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-5 py-2.5 font-bold text-sm text-slate-300 border border-slate-850 hover:bg-slate-900 rounded-xl transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 font-bold text-sm text-white bg-brand-600 rounded-xl hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-250 flex items-center gap-2"
        >
          {isSubmitting ? 'Processing...' : isEdit ? 'Save Changes' : 'Create Firm'}
        </button>
      </div>
    </form>
  );
};

export default FirmForm;
