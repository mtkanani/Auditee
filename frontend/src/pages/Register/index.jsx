import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { StepTracker } from '../../components/ui/StepTracker';
import { useRegister } from './useRegister';
import { EmailStep } from './EmailStep';
import { OtpStep } from './OtpStep';
import { ProfileStep } from './ProfileStep';

const Register = () => {
  const form = useRegister();
  const { step, emailAddress, handleSubmit, onSubmit } = form;

  return (
    <AuthLayout
      title={step === 1 ? 'Create your account' : step === 2 ? 'Check your email' : 'Your details'}
      subtitle={
        step === 1
          ? "Start with your work email. We'll send a code to confirm it's yours."
          : step === 2
            ? `Enter the 6-digit code we sent to ${emailAddress}.`
            : 'Almost done. Tell us who you are and choose a password.'
      }
    >
      <StepTracker step={step} steps={['Email', 'Code', 'Details']} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {step === 1 && <EmailStep {...form} />}

        {step === 2 && <OtpStep {...form} />}

        {step === 3 && <ProfileStep {...form} />}

        {step < 3 && (
          <p className="text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-accent-fg hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        )}
      </form>
    </AuthLayout>
  );
};

export default Register;
