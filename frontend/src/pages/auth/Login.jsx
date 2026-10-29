import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowRight, CircleAlert, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
// Imported file by file: Login is in the main bundle, so keep it free of the heavier kit pieces.
import { Button } from '../../components/ui/Button';
import { Field, Input } from '../../components/ui/Field';
import { PasswordInput } from '../../components/ui/PasswordInput';

export const Login = () => {
  const { login } = useAuth();
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
      const { redirectPath } = await login(data.email, data.password);
      toast.success('Welcome back to Auditee!');
      navigate(redirectPath, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-fg">Welcome back</h2>
        <p className="mt-1 text-sm text-muted">Sign in to your Auditee workspace.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Field label="Email" error={errors.email?.message}>
          {(p) => (
            <Input
              {...p}
              type="email"
              icon={Mail}
              autoComplete="username"
              placeholder="name@firm.com"
              className="h-11"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
              })}
            />
          )}
        </Field>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="text-sm font-medium text-fg">Password</label>
            <Link to="/forgot-password" className="text-sm font-medium text-accent-fg hover:underline underline-offset-4">
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            placeholder="Your password"
            invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            className="h-11"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && (
            <p id="login-password-error" className="flex items-center gap-1.5 text-xs font-medium text-danger">
              <CircleAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" variant="primary" size="lg" iconRight={ArrowRight} loading={isLoading} className="w-full">
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        New to Auditee?{' '}
        <Link to="/register" className="font-medium text-accent-fg hover:underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </div>
  );
};
