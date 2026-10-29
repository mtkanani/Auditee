import React from 'react';
import { Field, PasswordInput } from '../../ui';

export const AdminPasswordFields = ({ register, errors, passwordValue }) => (
  <>
    <Field
      label="Password"
      required
      hint="8+ characters with upper and lower case, a number and a symbol."
      error={errors.firmAdmin?.password?.message}
    >
      {(p) => (
        <PasswordInput
          {...p}
          autoComplete="new-password"
          {...register('firmAdmin.password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters long' },
            validate: {
              uppercase: (v) => /[A-Z]/.test(v) || 'Must contain at least one uppercase letter',
              lowercase: (v) => /[a-z]/.test(v) || 'Must contain at least one lowercase letter',
              number: (v) => /[0-9]/.test(v) || 'Must contain at least one number',
              special: (v) => /[^A-Za-z0-9]/.test(v) || 'Must contain at least one special character',
            },
          })}
        />
      )}
    </Field>

    <Field label="Confirm password" required error={errors.firmAdmin?.confirmPassword?.message}>
      {(p) => (
        <PasswordInput
          {...p}
          autoComplete="new-password"
          {...register('firmAdmin.confirmPassword', {
            required: 'Please confirm the password',
            validate: (val) => val === passwordValue || 'Passwords do not match',
          })}
        />
      )}
    </Field>
  </>
);
