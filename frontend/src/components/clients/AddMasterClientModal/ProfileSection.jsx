import React from 'react';
import { Field, Input, Select } from '../../ui';
import { StepCard } from './StepCard';

const CLIENT_TYPES = [
  { value: 'INDIVIDUAL', label: 'Individual' },
  { value: 'PRIVATE_LIMITED', label: 'Private limited' },
  { value: 'PARTNERSHIP', label: 'Partnership firm' },
  { value: 'LLP', label: 'LLP' },
  { value: 'PROPRIETORSHIP', label: 'Proprietorship' },
  { value: 'TRUST', label: 'Trust or NGO' },
];

/** Inputs keep their `name`: handleInputChange reads e.target.name. */
export const ProfileSection = ({ formData, handleInputChange, isVerified, fieldErrors }) => (
  <StepCard step={2} title="Client profile" description="How the client appears in Auditee, and their portal login.">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Display name" required error={fieldErrors.clientName}>
        {(p) => <Input {...p} name="clientName" value={formData.clientName} onChange={handleInputChange} disabled={!isVerified} required placeholder="Apex Tech Pvt Ltd" />}
      </Field>
      <Field label="Constitution" required>
        {(p) => <Select {...p} name="clientType" value={formData.clientType} onChange={handleInputChange} disabled={!isVerified} options={CLIENT_TYPES} />}
      </Field>
      <Field label="Legal name">
        {(p) => <Input {...p} name="companyName" value={formData.companyName} onChange={handleInputChange} disabled={!isVerified} placeholder="Full legal name" />}
      </Field>
      <Field label="Industry">
        {(p) => <Input {...p} name="businessType" value={formData.businessType} onChange={handleInputChange} disabled={!isVerified} placeholder="Manufacturing, IT, services" />}
      </Field>
      <Field label="Portal login email" required error={fieldErrors.email}>
        {(p) => <Input {...p} type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isVerified} required placeholder="client@company.com" />}
      </Field>
      <Field label="Initial password" error={fieldErrors.password} hint="At least 6 characters">
        {(p) => <Input {...p} type="password" name="password" value={formData.password} onChange={handleInputChange} disabled={!isVerified} placeholder="••••••••" />}
      </Field>
    </div>
  </StepCard>
);
