import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.sendForgotPasswordOtp(data.email);
      toast.success('Verification OTP sent to your email!');
      navigate('/reset-password', { state: { email: data.email } });
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP. User may not exist.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-100">Forgot Password?</h3>
        <p className="text-xs text-slate-400 mt-1">Enter your registered email to receive a password reset OTP</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Email</label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="email"
              {...register('email', { required: 'Email address is required' })}
              placeholder="user@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Sending Reset OTP...' : 'Send Reset OTP'}
        </button>
      </form>

      <div className="text-center pt-2">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-semibold hover:text-indigo-300">
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
};
