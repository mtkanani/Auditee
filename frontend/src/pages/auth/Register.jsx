import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

export const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      toast.success('Registration successful! Please sign in with your credentials.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-100">Create Auditee Account</h3>
        <p className="text-xs text-slate-400 mt-1">Register your details to start managing your CA firm</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          {/* First Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
            <input
              type="text"
              {...register('firstName', { required: 'First name is required' })}
              placeholder="John"
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {errors.firstName && <p className="text-[10px] text-rose-400 mt-0.5">{errors.firstName.message}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
            <input
              type="text"
              {...register('lastName', { required: 'Last name is required' })}
              placeholder="Doe"
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {errors.lastName && <p className="text-[10px] text-rose-400 mt-0.5">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            placeholder="john@cafirm.com"
            className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          {errors.email && <p className="text-[10px] text-rose-400 mt-0.5">{errors.email.message}</p>}
        </div>

        {/* Mobile & City */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number</label>
            <input
              type="text"
              {...register('mobileNumber', {
                required: 'Mobile is required',
                minLength: { value: 10, message: 'Must be 10 digits' },
              })}
              placeholder="9876543210"
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {errors.mobileNumber && <p className="text-[10px] text-rose-400 mt-0.5">{errors.mobileNumber.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
            <input
              type="text"
              {...register('city', { required: 'City is required' })}
              placeholder="Mumbai"
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {errors.city && <p className="text-[10px] text-rose-400 mt-0.5">{errors.city.message}</p>}
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters' },
            })}
            placeholder="Password@123"
            className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          {errors.password && <p className="text-[10px] text-rose-400 mt-0.5">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Confirm password is required',
              validate: (val) => val === password || 'Passwords do not match',
            })}
            placeholder="Password@123"
            className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          {errors.confirmPassword && (
            <p className="text-[10px] text-rose-400 mt-0.5">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
        >
          {isLoading ? 'Creating Account...' : 'Register Account'}
        </button>
      </form>

      <div className="text-center pt-3 border-t border-slate-800">
        <p className="text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
