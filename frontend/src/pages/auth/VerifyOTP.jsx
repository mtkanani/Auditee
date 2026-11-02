import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { Button } from '../../components/ui/Button';
import { Field, Input } from '../../components/ui/Field';

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
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-fg">Verify your email</h2>
        <p className="mt-1 text-sm text-muted">Enter the 6-digit code sent to {email || 'your email'}.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field label="Email">
          {(p) => <Input {...p} type="email" icon={Mail} autoComplete="email" className="h-11" {...register('email', { required: true })} />}
        </Field>
        <Field label="6-digit code">
          {(p) => (
            <Input
              {...p}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="••••••"
              className="h-12 text-center text-lg font-semibold tracking-[0.5em]"
              {...register('otp', { required: true, minLength: 6, maxLength: 6 })}
            />
          )}
        </Field>
        <Button type="submit" variant="primary" size="lg" loading={isLoading} className="w-full">
          Verify email
        </Button>
      </form>
    </div>
  );
};
