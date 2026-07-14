import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Shield, Lock, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';
import { authApi } from '../../api/authApi';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Verify OTP, 3 = Reset Password
  const [emailAddress, setEmailAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordValue = watch('newPassword');

  // Step 1: Request OTP
  const handleSendOTP = async (data) => {
    setSubmitting(true);
    try {
      await authApi.forgotPasswordOTP(data.email);
      setEmailAddress(data.email);
      toast.success('Reset OTP sent successfully! Please check your email.', {
        position: 'top-right',
        autoClose: 3500,
        theme: 'dark',
      });
      setStep(2);
    } catch (error) {
      toast.error(error.message || 'Failed to request OTP. Check if the email exists.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (data) => {
    setSubmitting(true);
    try {
      await authApi.verifyForgotOTP(emailAddress, data.otp);
      toast.success('OTP verified successfully! Now set a new password.', {
        position: 'top-right',
        autoClose: 3500,
        theme: 'dark',
      });
      setStep(3);
    } catch (error) {
      toast.error(error.message || 'Invalid or expired OTP. Please try again.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (data) => {
    setSubmitting(true);
    try {
      await authApi.resetPassword(emailAddress, data.newPassword, data.confirmPassword);
      toast.success('Password reset successful! You can now log in.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to reset password. Please try again.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = (data) => {
    if (step === 1) {
      handleSendOTP(data);
    } else if (step === 2) {
      handleVerifyOTP(data);
    } else if (step === 3) {
      handleResetPassword(data);
    }
  };

  return (
    <AuthLayout
      title={
        step === 1
          ? 'Reset Password'
          : step === 2
            ? 'Verify Recovery OTP'
            : 'New Password'
      }
      subtitle={
        step === 1
          ? 'Enter your email address to receive a recovery code'
          : step === 2
            ? `Enter the 6-digit verification code sent to ${emailAddress}`
            : 'Create a secure new password for your account'
      }
    >
      {/* Step Indicator Header */}
      <div className="flex items-center justify-between mb-8 px-4">
        {[1, 2, 3].map((num) => (
          <React.Fragment key={num}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-300
                  ${step === num
                    ? 'bg-brand-500 text-white shadow-glow-indigo/50 border border-brand-400'
                    : step > num
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'}
                `}
              >
                {step > num ? '✓' : num}
              </div>
            </div>
            {num < 3 && (
              <div
                className={`
                  flex-1 h-0.5 mx-2 rounded transition-all duration-300
                  ${step > num ? 'bg-emerald-500/40' : 'bg-slate-800'}
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Step 1: Input Email */}
        {step === 1 && (
          <div className="animate-fade-in space-y-4">
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="name@example.com"
              icon={Mail}
              error={errors.email}
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address format',
                },
              })}
            />
            
            <Button
              type="submit"
              loading={submitting}
              className="mt-6"
            >
              <span className="flex items-center justify-center gap-2">
                <span>Send Verification OTP</span>
                <ArrowRight size={16} />
              </span>
            </Button>
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <div className="animate-fade-in space-y-4">
            <InputField
              label="Verification OTP"
              name="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              icon={Shield}
              maxLength={6}
              error={errors.otp}
              {...register('otp', {
                required: 'OTP code is required',
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: 'OTP must be exactly 6 digits',
                },
              })}
            />

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="secondary"
                disabled={submitting}
                onClick={() => setStep(1)}
              >
                <ArrowLeft size={16} />
              </Button>

              <Button
                type="submit"
                loading={submitting}
              >
                <span>Verify OTP</span>
              </Button>
            </div>

            <p className="text-center text-xs text-slate-500 mt-4">
              Didn't receive a code?{' '}
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSendOTP({ email: emailAddress })}
                className="font-semibold text-brand-400 hover:text-brand-300 transition-colors focus:outline-none"
              >
                Resend OTP
              </button>
            </p>
          </div>
        )}

        {/* Step 3: Enter New Password */}
        {step === 3 && (
          <div className="animate-fade-in space-y-4">
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

            <InputField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.confirmPassword}
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: (val) => val === newPasswordValue || 'Passwords do not match',
              })}
            />

            <Button
              type="submit"
              loading={submitting}
              className="mt-6"
            >
              Reset Password
            </Button>
          </div>
        )}

        {/* Navigation options */}
        {step < 3 && (
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        )}
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
