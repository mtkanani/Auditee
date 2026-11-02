import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Field, Input } from '../../components/ui/Field';

export const OtpStep = ({ errors, register, submitting, setStep, handleSendOTP, emailAddress }) => (
  <>
    <Field label="6-digit code" error={errors.otp?.message}>
      {(p) => (
        <Input
          {...p}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="••••••"
          className="h-12 text-center text-lg font-semibold tracking-[0.5em]"
          {...register('otp', {
            required: 'OTP code is required',
            pattern: {
              value: /^[0-9]{6}$/,
              message: 'OTP must be exactly 6 digits',
            },
          })}
        />
      )}
    </Field>

    <div className="flex gap-2">
      <Button size="lg" aria-label="Back to email" disabled={submitting} onClick={() => setStep(1)} className="w-12 px-0">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
      </Button>
      <Button type="submit" variant="primary" size="lg" loading={submitting} className="flex-1">
        Verify and continue
      </Button>
    </div>

    <p className="text-center text-sm text-muted">
      Didn't get it?{' '}
      <button
        type="button"
        disabled={submitting}
        onClick={() => handleSendOTP({ email: emailAddress })}
        className="font-medium text-accent-fg hover:underline underline-offset-4 disabled:opacity-50"
      >
        Send a new code
      </button>
    </p>
  </>
);
