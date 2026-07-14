import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Lock, ArrowLeft } from 'lucide-react';
import { authApi } from '../../api/authApi';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  
  const email = searchParams.get('email') || '';

  // Safeguard: Redirect if email is missing
  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please request a new OTP.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      });
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('newPassword');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await authApi.resetPassword(email, data.newPassword, data.confirmPassword);
      toast.success('Password reset successful! You can now log in.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to reset password. Please request a new OTP.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Set a secure, new password for your account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* New Password Input */}
        <InputField
          label="New Password"
          name="newPassword"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.newPassword}
          {...register('newPassword', {
            required: 'New password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
            validate: {
              hasUpper: (val) => /[A-Z]/.test(val) || 'Must contain at least 1 uppercase letter',
              hasLower: (val) => /[a-z]/.test(val) || 'Must contain at least 1 lowercase letter',
              hasNumber: (val) => /[0-9]/.test(val) || 'Must contain at least 1 number',
              hasSpecial: (val) => /[^A-Za-z0-9]/.test(val) || 'Must contain at least 1 special character',
            },
          })}
        />

        {/* Confirm Password Input */}
        <InputField
          label="Confirm New Password"
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

        <Button
          type="submit"
          loading={submitting}
          className="mt-6"
        >
          Reset Password
        </Button>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
