import React from 'react';
import { ShieldAlert, UserCheck } from 'lucide-react';
import { AdminPasswordFields } from './AdminPasswordFields';

export const AdminDetailsSection = (props) => {
  const { register, errors, isEdit } = props;

  return (
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
        {!isEdit && <AdminPasswordFields {...props} />}
      </div>
    </div>
  );
};
