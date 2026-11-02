import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Field, Input } from '../../components/ui/Field';

export const EmailStep = ({ errors, register, submitting }) => (
  <>
    <Field label="Email" error={errors.email?.message}>
      {(p) => (
        <Input
          {...p}
          type="email"
          icon={Mail}
          autoComplete="email"
          placeholder="name@firm.com"
          className="h-11"
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address format',
            },
          })}
        />
      )}
    </Field>
    <Button type="submit" variant="primary" size="lg" iconRight={ArrowRight} loading={submitting} className="w-full">
      Send code
    </Button>
  </>
);
