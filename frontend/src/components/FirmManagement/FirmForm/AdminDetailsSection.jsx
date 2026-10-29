import React from 'react';
import { UserCheck } from 'lucide-react';
import { AdminPasswordFields } from './AdminPasswordFields';
import { FormSection, TextField } from './FormSection';

export const AdminDetailsSection = (props) => {
  const { register, errors, isEdit } = props;
  const err = (key) => errors.firmAdmin?.[key]?.message;

  return (
    <FormSection icon={UserCheck} title="Firm admin">
      <TextField
        register={register}
        name="firmAdmin.firstName"
        label="First name"
        error={err('firstName')}
        rules={{ required: 'First name is required', minLength: { value: 2, message: 'Must be at least 2 characters' } }}
      />
      <TextField
        register={register}
        name="firmAdmin.lastName"
        label="Last name"
        error={err('lastName')}
        rules={{ required: 'Last name is required', minLength: { value: 2, message: 'Must be at least 2 characters' } }}
      />
      <TextField
        register={register}
        name="firmAdmin.email"
        label="Admin email"
        type="email"
        error={err('email')}
        rules={{
          required: 'Admin email is required',
          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
        }}
      />
      <TextField
        register={register}
        name="firmAdmin.phone"
        label="Admin phone"
        type="tel"
        error={err('phone')}
        rules={{
          required: 'Admin phone is required',
          minLength: { value: 10, message: 'Must be at least 10 digits' },
          maxLength: { value: 15, message: 'Must not exceed 15 digits' },
        }}
      />

      {/* Password (Only if creating) */}
      {!isEdit && <AdminPasswordFields {...props} />}
    </FormSection>
  );
};
