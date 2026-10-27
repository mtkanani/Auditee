import React from 'react';
import { Building2, ShieldAlert } from 'lucide-react';

export const FirmDetailsSection = ({ register, errors }) => (
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
);
