import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { useRegister } from './useRegister';
import { StepTracker } from './StepTracker';
import { EmailStep } from './EmailStep';
import { OtpStep } from './OtpStep';
import { ProfileStep } from './ProfileStep';

const Register = () => {
  const form = useRegister();
  const { step, emailAddress, handleSubmit, onSubmit } = form;

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
      <StepTracker step={step} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Step 1: Email Form */}
        {step === 1 && <EmailStep {...form} />}

        {/* Step 2: OTP Verification Form */}
        {step === 2 && <OtpStep {...form} />}

        {/* Step 3: Registration Profile and Password Setup */}
        {step === 3 && <ProfileStep {...form} />}

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
