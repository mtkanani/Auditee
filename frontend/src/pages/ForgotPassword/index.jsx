import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, KeyRound, Mail } from 'lucide-react';
import { authApi } from '../../api/authApi';
import AuthLayout from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Field, Input } from '../../components/ui/Field';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { StepTracker } from '../../components/ui/StepTracker';

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
      toast.success('Reset OTP sent successfully! Please check your email.');
      setStep(2);
    } catch (error) {
      toast.error(error.message || 'Failed to request OTP. Check if the email exists.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (data) => {
    setSubmitting(true);
    try {
      await authApi.verifyForgotOTP(emailAddress, data.otp);
      toast.success('OTP verified successfully! Now set a new password.');
      setStep(3);
    } catch (error) {
      toast.error(error.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (data) => {
    setSubmitting(true);
    try {
      await authApi.resetPassword(emailAddress, data.newPassword, data.confirmPassword);
      toast.success('Password reset successful! You can now log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to reset password. Please try again.');
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
      title={step === 1 ? 'Reset your password' : step === 2 ? 'Check your email' : 'Choose a new password'}
      subtitle={
        step === 1
          ? "Enter your account's email and we'll send you a 6-digit code."
          : step === 2
            ? `Enter the 6-digit code we sent to ${emailAddress}.`
            : 'Use at least 8 characters with upper and lower case letters, a number and a symbol.'
      }
    >
      <StepTracker step={step} steps={['Email', 'Code', 'New password']} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {step === 1 && (
          <>
            <Field label="Email" error={errors.email?.message}>
              {(p) => (
                <Input
                  {...p}
                  type="email"
                  icon={Mail}
                  autoComplete="email"
                  placeholder="name@firm.com"
                  className="h-11"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address format',
                    },
                  })}
                />
              )}
            </Field>
            <Button type="submit" variant="primary" size="lg" iconRight={ArrowRight} loading={submitting} className="w-full">
              Send code
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="6-digit code" error={errors.otp?.message}>
              {(p) => (
                <Input
                  {...p}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="••••••"
                  className="h-12 text-center text-lg font-semibold tracking-[0.5em]"
                  {...register('otp', {
                    required: 'OTP code is required',
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: 'OTP must be exactly 6 digits',
                    },
                  })}
                />
              )}
            </Field>
            <div className="flex gap-2">
              <Button size="lg" aria-label="Back to email" disabled={submitting} onClick={() => setStep(1)} className="w-12 px-0">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </Button>
              <Button type="submit" variant="primary" size="lg" loading={submitting} className="flex-1">
                Verify code
              </Button>
            </div>
            <p className="text-center text-sm text-muted">
              Didn't get it?{' '}
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSendOTP({ email: emailAddress })}
                className="font-medium text-accent-fg hover:underline underline-offset-4 disabled:opacity-50"
              >
                Send a new code
              </button>
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <Field label="New password" error={errors.newPassword?.message}>
              {(p) => (
                <PasswordInput
                  {...p}
                  autoComplete="new-password"
                  className="h-11"
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
              )}
            </Field>
            <Field label="Confirm new password" error={errors.confirmPassword?.message}>
              {(p) => (
                <PasswordInput
                  {...p}
                  icon={KeyRound}
                  autoComplete="new-password"
                  className="h-11"
                  {...register('confirmPassword', {
                    required: 'Confirm password is required',
                    validate: (val) => val === newPasswordValue || 'Passwords do not match',
                  })}
                />
              )}
            </Field>
            <Button type="submit" variant="primary" size="lg" loading={submitting} className="w-full">
              Save new password
            </Button>
          </>
        )}

        {step < 3 && (
          <p className="text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-fg">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to sign in
            </Link>
          </p>
        )}
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
