import React from 'react';
import { Building2 } from 'lucide-react';
import { FormSection, TextField } from './FormSection';

export const FirmDetailsSection = ({ register, errors }) => {
  const err = (key) => errors.firm?.[key]?.message;
  return (
    <FormSection icon={Building2} title="Firm details">
      <TextField
        register={register}
        name="firm.firmName"
        label="Firm name"
        autoComplete="organization"
        error={err('firmName')}
        rules={{
          required: 'Firm name is required',
          minLength: { value: 2, message: 'Must be at least 2 characters' },
          maxLength: { value: 100, message: 'Must not exceed 100 characters' },
        }}
      />
      <TextField
        register={register}
        name="firm.email"
        label="Firm email"
        type="email"
        error={err('email')}
        rules={{
          required: 'Firm email is required',
          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
        }}
      />
      <TextField
        register={register}
        name="firm.phone"
        label="Firm phone"
        type="tel"
        error={err('phone')}
        rules={{
          required: 'Firm phone is required',
          minLength: { value: 10, message: 'Must be at least 10 digits' },
          maxLength: { value: 15, message: 'Must not exceed 15 digits' },
        }}
      />
      <TextField
        register={register}
        name="firm.pincode"
        label="PIN code"
        inputMode="numeric"
        error={err('pincode')}
        rules={{ maxLength: { value: 10, message: 'Must not exceed 10 characters' } }}
      />
      <TextField
        register={register}
        name="firm.address"
        label="Address"
        wide
        error={err('address')}
        rules={{ maxLength: { value: 255, message: 'Must not exceed 255 characters' } }}
      />
      <TextField register={register} name="firm.city" label="City" />
      <TextField register={register} name="firm.state" label="State" />
      <TextField register={register} name="firm.country" label="Country" wide />
    </FormSection>
  );
};
