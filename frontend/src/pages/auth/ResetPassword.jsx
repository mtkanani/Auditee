import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiLock, FiKey, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultEmail = location.state?.email || '';

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = verify OTP, 2 = reset password

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { email: defaultEmail } });

  const newPassword = watch('newPassword');

  const onVerifyOtp = async (data) => {
    setIsLoading(true);
    try {
      await authService.verifyForgotPasswordOtp(data.email, data.otp);
      toast.success('OTP verified! Now enter your new password.');
      setStep(2);
    } catch (error) {
      toast.error(error.message || 'Invalid or expired OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (data) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(data.email, data.newPassword, data.confirmPassword);
      toast.success('Password reset successfully! Please sign in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Password reset failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-100">
          {step === 1 ? 'Verify OTP Code' : 'Set New Password'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {step === 1
            ? 'Enter the 6-digit code sent to your email'
            : 'Create a new strong password for your account'}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSubmit(onVerifyOtp)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              placeholder="user@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">6-Digit OTP Code</label>
            <input
              type="text"
              {...register('otp', { required: 'OTP is required', minLength: 6, maxLength: 6 })}
              placeholder="123456"
              maxLength={6}
              className="w-full text-center tracking-widest text-lg font-bold px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
            {errors.otp && <p className="text-xs text-rose-400 mt-1">{errors.otp.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition-all"
          >
            {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit(onResetPassword)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              {...register('newPassword', { required: 'New password is required', minLength: 8 })}
              placeholder="NewPassword@123"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: (val) => val === newPassword || 'Passwords do not match',
              })}
              placeholder="NewPassword@123"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-rose-400 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition-all"
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      )}

      <div className="text-center pt-2">
        <Link to="/login" className="text-xs text-indigo-400 font-semibold hover:text-indigo-300">
          Back to Login
        </Link>
      </div>
    </div>
  );
};
