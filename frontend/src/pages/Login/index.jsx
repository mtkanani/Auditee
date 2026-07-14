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
  const { login, verifyLoginOtp } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');

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
      if (showOtpInput) {
        if (!otpValue || otpValue.length !== 6) {
          toast.error('Please enter a valid 6-digit OTP code.');
          setSubmitting(false);
          return;
        }
        await verifyLoginOtp(otpEmail, otpValue);
        toast.success('Welcome back! Login successful.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'dark',
        });
        navigate('/profile');
      } else {
        const result = await login(data.email, data.password);
        if (result && result.requireOtp) {
          setOtpEmail(data.email);
          setShowOtpInput(true);
          toast.info('Please check your email for the verification code.', {
            position: 'top-right',
            autoClose: 4000,
            theme: 'dark',
          });
        } else {
          toast.success('Welcome back! Login successful.', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'dark',
          });
          navigate('/profile');
        }
      }
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
      title={showOtpInput ? "Verify Login" : "Welcome Back"} 
      subtitle={showOtpInput ? `We sent a verification code to ${otpEmail}` : "Sign in to your Auditee account to continue"}
    >
      <form 
        onSubmit={(e) => {
          if (showOtpInput) {
            e.preventDefault();
            onSubmit();
          } else {
            handleSubmit(onSubmit)(e);
          }
        }} 
        className="space-y-5"
      >
        {showOtpInput ? (
          <>
            {/* OTP Input */}
            <InputField
              label="Verification Code (OTP)"
              name="otp"
              type="text"
              placeholder="123456"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
              icon={Lock}
            />

            {/* Submit button */}
            <Button 
              type="submit" 
              loading={submitting} 
              className="mt-6"
            >
              Verify & Sign In
            </Button>

            {/* Back to Login link */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowOtpInput(false);
                  setOtpValue('');
                }}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </form>
    </AuthLayout>
  );
};

export default Login;
