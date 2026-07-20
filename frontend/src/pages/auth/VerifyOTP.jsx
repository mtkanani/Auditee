import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

export const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: { email },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.verifyOtp(data.email, data.otp);
      toast.success('Email verified successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-100">Verify Email OTP</h3>
        <p className="text-xs text-slate-400 mt-1">Enter 6-digit OTP code sent to {email || 'your email'}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
          <input
            type="email"
            {...register('email', { required: true })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">OTP Code</label>
          <input
            type="text"
            {...register('otp', { required: true, minLength: 6, maxLength: 6 })}
            placeholder="123456"
            maxLength={6}
            className="w-full text-center tracking-widest text-lg font-bold px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl transition-all"
        >
          {isLoading ? 'Verifying...' : 'Submit OTP'}
        </button>
      </form>
    </div>
  );
};
