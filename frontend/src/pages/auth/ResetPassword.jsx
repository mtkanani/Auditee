import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { Button } from '../../components/ui/Button';
import { Field, Input } from '../../components/ui/Field';
import { PasswordInput } from '../../components/ui/PasswordInput';

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
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-fg">{step === 1 ? 'Enter your code' : 'Choose a new password'}</h2>
        <p className="mt-1 text-sm text-muted">
          {step === 1 ? 'Enter the 6-digit code sent to your email.' : 'Use at least 8 characters.'}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSubmit(onVerifyOtp)} className="space-y-5" noValidate>
          <Field label="Email" error={errors.email?.message}>
            {(p) => <Input {...p} type="email" icon={Mail} autoComplete="email" placeholder="name@firm.com" className="h-11" {...register('email', { required: 'Email is required' })} />}
          </Field>
          <Field label="6-digit code" error={errors.otp?.message || (errors.otp && 'Enter the 6-digit code')}>
            {(p) => (
              <Input
                {...p}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="••••••"
                className="h-12 text-center text-lg font-semibold tracking-[0.5em]"
                {...register('otp', { required: 'OTP is required', minLength: 6, maxLength: 6 })}
              />
            )}
          </Field>
          <Button type="submit" variant="primary" size="lg" loading={isLoading} className="w-full">
            Verify code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit(onResetPassword)} className="space-y-5" noValidate>
          <Field label="New password" error={errors.newPassword?.message || (errors.newPassword && 'Use at least 8 characters')}>
            {(p) => <PasswordInput {...p} autoComplete="new-password" className="h-11" {...register('newPassword', { required: 'New password is required', minLength: 8 })} />}
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
                  validate: (val) => val === newPassword || 'Passwords do not match',
                })}
              />
            )}
          </Field>
          <Button type="submit" variant="primary" size="lg" loading={isLoading} className="w-full">
            Save new password
          </Button>
        </form>
      )}

      <p className="text-center">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-fg">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to sign in
        </Link>
      </p>
    </div>
  );
};
