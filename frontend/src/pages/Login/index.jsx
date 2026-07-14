import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back! Login successful.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      });
      navigate('/profile');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.', {
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
      title="Welcome Back" 
      subtitle="Sign in to your Auditee account to continue"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Input */}
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

        {/* Password Input */}
        <div className="relative">
          <div className="flex justify-between items-center mb-1.5 absolute right-0 top-0 z-10">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.password}
            {...register('password', {
              required: 'Password is required',
            })}
          />
        </div>

        {/* Submit button */}
        <Button 
          type="submit" 
          loading={submitting} 
          className="mt-6"
        >
          Sign In
        </Button>

        {/* Signup redirection */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
