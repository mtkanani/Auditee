import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

export const OtpStep = ({ errors, register, submitting, setStep, handleSendOTP, emailAddress }) => (
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
);
