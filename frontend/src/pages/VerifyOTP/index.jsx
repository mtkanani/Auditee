import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Shield, ArrowLeft } from 'lucide-react';
import { authApi } from '../../api/authApi';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  
  const email = searchParams.get('email') || '';
  const type = searchParams.get('type') || 'forgot';

  // Safeguard: Redirect if email is missing
  useEffect(() => {
    if (!email) {
      toast.error('No email address provided for OTP verification.', {
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
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (type === 'forgot') {
        await authApi.verifyForgotOTP(email, data.otp);
        toast.success('OTP verified successfully! Reset your password.', {
          position: 'top-right',
          autoClose: 3500,
          theme: 'dark',
        });
        // Proceed to Reset Password page
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        // Fallback for regular registration OTP verification if routed directly
        await authApi.verifyOTP(email, data.otp);
        toast.success('OTP verified successfully!', {
          position: 'top-right',
          autoClose: 3500,
          theme: 'dark',
        });
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.message || 'OTP verification failed. Check the code and try again.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      if (type === 'forgot') {
        await authApi.forgotPasswordOTP(email);
      } else {
        await authApi.sendOTP(email);
      }
      toast.success('OTP resent successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      });
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP. Please try again later.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
    }
  };

  return (
    <AuthLayout
      title="Verify Code"
      subtitle={`Please enter the 6-digit OTP sent to ${email}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          label="Verification Code"
          name="otp"
          type="text"
          placeholder="000000"
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

        <Button
          type="submit"
          loading={submitting}
          className="mt-6"
        >
          Verify OTP
        </Button>

        <div className="flex flex-col gap-4 mt-6 text-center">
          <p className="text-xs text-slate-400">
            Didn't receive a code?{' '}
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-brand-400 hover:text-brand-300 transition-colors focus:outline-none"
            >
              Resend OTP
            </button>
          </p>

          <Link
            to={type === 'forgot' ? '/forgot-password' : '/register'}
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default VerifyOTP;
