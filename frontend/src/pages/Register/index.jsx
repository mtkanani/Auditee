import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Shield, User, Phone, MapPin, Lock, ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import { authApi } from '../../api/authApi';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Steps: 1 = Email, 2 = Verify OTP, 3 = Complete Registration
  const [emailAddress, setEmailAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form setups
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      otp: '',
      firstName: '',
      lastName: '',
      mobileNumber: '',
      city: '',
      role: 'user',
      password: '',
      confirmPassword: '',
      confirmDetails: false,
    },
  });

  const passwordValue = watch('password');

  // Step 1: Send OTP
  const handleSendOTP = async (data) => {
    setSubmitting(true);
    try {
      await authApi.sendOTP(data.email);
      setEmailAddress(data.email);
      toast.success('OTP sent successfully! Please check your email.', {
        position: 'top-right',
        autoClose: 3500,
        theme: 'dark',
      });
      setStep(2);
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP. Please try again.', {
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
      await authApi.verifyOTP(emailAddress, data.otp);
      toast.success('OTP verified successfully! Please complete registration.', {
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

  // Step 3: Register user
  const handleRegisterUser = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        email: emailAddress, // Use the verified email
        password: data.password,
        confirmPassword: data.confirmPassword,
        city: data.city,
        role: data.role, // User selected role
      };

      await authApi.register(payload);
      toast.success('Registration successful! Please log in.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please check input parameters.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Master submit router depending on current active step
  const onSubmit = (data) => {
    if (step === 1) {
      handleSendOTP(data);
    } else if (step === 2) {
      handleVerifyOTP(data);
    } else if (step === 3) {
      handleRegisterUser(data);
    }
  };

  return (
    <AuthLayout
      title={
        step === 1 
          ? 'Create Account' 
          : step === 2 
            ? 'Verify Email' 
            : 'Complete Profile'
      }
      subtitle={
        step === 1
          ? 'Enter your email to verify and start registration'
          : step === 2
            ? `We've sent a 6-digit OTP code to ${emailAddress}`
            : 'Fill in your details to create your secure account'
      }
    >
      {/* Visual Stepper Tracker */}
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
        {/* Step 1: Email Form */}
        {step === 1 && (
          <div className="animate-fade-in">
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

        {/* Step 2: OTP Verification Form */}
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
                <span>Verify & Continue</span>
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

        {/* Step 3: Registration Profile and Password Setup */}
        {step === 3 && (
          <div className="animate-fade-in space-y-4 max-h-[350px] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="First Name"
                name="firstName"
                placeholder="John"
                icon={User}
                error={errors.firstName}
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: { value: 2, message: 'Min 2 characters' },
                  maxLength: { value: 50, message: 'Max 50 characters' },
                })}
              />
              
              <InputField
                label="Last Name"
                name="lastName"
                placeholder="Doe"
                icon={User}
                error={errors.lastName}
                {...register('lastName', {
                  required: 'Last name is required',
                  minLength: { value: 2, message: 'Min 2 characters' },
                  maxLength: { value: 50, message: 'Max 50 characters' },
                })}
              />
            </div>

            <InputField
              label="Mobile Number"
              name="mobileNumber"
              type="tel"
              placeholder="10-digit number"
              icon={Phone}
              maxLength={10}
              error={errors.mobileNumber}
              {...register('mobileNumber', {
                required: 'Mobile number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Must be exactly 10 digits',
                },
              })}
            />

            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="City"
                name="city"
                placeholder="Enter your city"
                icon={MapPin}
                error={errors.city}
                {...register('city', {
                  required: 'City is required',
                  maxLength: { value: 100, message: 'Max 100 characters' },
                })}
              />

              {/* Role Selector */}
              <div className="w-full mb-4.5">
                <label 
                  htmlFor="role" 
                  className="block text-sm font-medium text-slate-300 mb-1.5 tracking-wide"
                >
                  Role
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <select
                    id="role"
                    className={`
                      w-full py-3 px-4 text-sm rounded-xl transition-all duration-200 glass-input border focus:outline-none appearance-none cursor-pointer
                      ${errors.role ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-brand-500'}
                    `}
                    {...register('role', { required: 'Role is required' })}
                  >
                    <option value="user" className="bg-slate-900 text-slate-100">User</option>
                    <option value="admin" className="bg-slate-900 text-slate-100">Admin</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                    <ChevronDown size={18} />
                  </div>
                </div>
                {errors.role && (
                  <p className="mt-1.5 text-xs text-rose-500 font-medium tracking-wide flex items-center gap-1 animate-fade-in">
                    <span className="inline-block w-1 h-1 rounded-full bg-rose-500"></span>
                    {errors.role.message}
                  </p>
                )}
              </div>
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
              label="Confirm Password"
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

            {/* Final Step Information Verification Checkbox */}
            <div className="w-full mt-3.5 mb-1.5">
              <label className="flex items-start gap-3 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded border-slate-800 bg-slate-900/60 text-brand-500 focus:ring-brand-500/20 focus:ring-offset-0 focus:outline-none transition-all cursor-pointer accent-brand-500"
                  {...register('confirmDetails', {
                    required: 'Verification check is required to register.',
                  })}
                />
                <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed">
                  I confirm that all the details provided above are accurate and true.
                </span>
              </label>
              {errors.confirmDetails && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium tracking-wide flex items-center gap-1 animate-fade-in">
                  <span className="inline-block w-1 h-1 rounded-full bg-rose-500"></span>
                  {errors.confirmDetails.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              loading={submitting}
              className="mt-5"
            >
              Complete Registration
            </Button>
          </div>
        )}

        {/* Redirect options (only visible on step 1 & 2) */}
        {step < 3 && (
          <p className="text-center text-sm text-slate-400 mt-6 animate-fade-in">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        )}
      </form>
    </AuthLayout>
  );
};

export default Register;
