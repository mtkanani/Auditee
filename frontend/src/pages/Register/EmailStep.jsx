import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

export const EmailStep = ({ errors, register, submitting }) => (
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
);
