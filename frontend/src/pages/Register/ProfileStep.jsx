import React from 'react';
import { CircleAlert, KeyRound, MapPin, Phone, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Field, Input, Select } from '../../components/ui/Field';
import { PasswordInput } from '../../components/ui/PasswordInput';

const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
];

export const ProfileStep = ({ errors, register, passwordValue, submitting }) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="First name" error={errors.firstName?.message}>
        {(p) => (
          <Input
            {...p}
            icon={User}
            autoComplete="given-name"
            placeholder="Asha"
            {...register('firstName', {
              required: 'First name is required',
              minLength: { value: 2, message: 'Min 2 characters' },
              maxLength: { value: 50, message: 'Max 50 characters' },
            })}
          />
        )}
      </Field>
      <Field label="Last name" error={errors.lastName?.message}>
        {(p) => (
          <Input
            {...p}
            autoComplete="family-name"
            placeholder="Patel"
            {...register('lastName', {
              required: 'Last name is required',
              minLength: { value: 2, message: 'Min 2 characters' },
              maxLength: { value: 50, message: 'Max 50 characters' },
            })}
          />
        )}
      </Field>
    </div>

    <Field label="Mobile number" error={errors.mobileNumber?.message}>
      {(p) => (
        <Input
          {...p}
          type="tel"
          icon={Phone}
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={10}
          placeholder="10-digit number"
          {...register('mobileNumber', {
            required: 'Mobile number is required',
            pattern: {
              value: /^[0-9]{10}$/,
              message: 'Must be exactly 10 digits',
            },
          })}
        />
      )}
    </Field>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="City" error={errors.city?.message}>
        {(p) => (
          <Input
            {...p}
            icon={MapPin}
            autoComplete="address-level2"
            placeholder="Ahmedabad"
            {...register('city', {
              required: 'City is required',
              maxLength: { value: 100, message: 'Max 100 characters' },
            })}
          />
        )}
      </Field>
      <Field label="Role" error={errors.role?.message}>
        {(p) => <Select {...p} options={ROLE_OPTIONS} {...register('role', { required: 'Role is required' })} />}
      </Field>
    </div>

    <Field
      label="Password"
      error={errors.password?.message}
      hint="At least 8 characters with upper and lower case letters, a number and a symbol."
    >
      {(p) => (
        <PasswordInput
          {...p}
          autoComplete="new-password"
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
      )}
    </Field>

    <Field label="Confirm password" error={errors.confirmPassword?.message}>
      {(p) => (
        <PasswordInput
          {...p}
          icon={KeyRound}
          autoComplete="new-password"
          {...register('confirmPassword', {
            required: 'Confirm password is required',
            validate: (val) => val === passwordValue || 'Passwords do not match',
          })}
        />
      )}
    </Field>

    <div className="space-y-1.5">
      <label className="flex items-start gap-3 cursor-pointer text-sm text-muted hover:text-fg transition-colors">
        <input
          type="checkbox"
          className="mt-0.5 w-4 h-4 rounded accent-[var(--accent)]"
          aria-invalid={errors.confirmDetails ? true : undefined}
          {...register('confirmDetails', {
            required: 'Verification check is required to register.',
          })}
        />
        <span>I confirm that all the details provided above are accurate and true.</span>
      </label>
      {errors.confirmDetails && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-danger">
          <CircleAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          {errors.confirmDetails.message}
        </p>
      )}
    </div>

    <Button type="submit" variant="primary" size="lg" loading={submitting} className="w-full">
      Create account
    </Button>
  </>
);
