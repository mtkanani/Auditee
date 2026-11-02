import React from 'react';
import { Field, Input } from '../../ui';
import { StepCard } from './StepCard';

/** Inputs keep their `name`: handleInputChange reads e.target.name. */
export const ContactSection = ({ formData, handleInputChange, isVerified, fieldErrors }) => (
  <StepCard step={3} title="Contact and address" description="Who you talk to at the client, and where they're based.">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Contact name">
        {(p) => <Input {...p} name="contactPersonName" value={formData.contactPersonName} onChange={handleInputChange} disabled={!isVerified} placeholder="Suresh Patel" />}
      </Field>
      <Field label="Designation">
        {(p) => <Input {...p} name="contactPersonDesignation" value={formData.contactPersonDesignation} onChange={handleInputChange} disabled={!isVerified} placeholder="Managing director" />}
      </Field>
      <Field label="Mobile" error={fieldErrors.contactPersonPhone || fieldErrors.phone}>
        {(p) => <Input {...p} type="tel" name="contactPersonPhone" value={formData.contactPersonPhone} onChange={handleInputChange} disabled={!isVerified} placeholder="98250 12345" />}
      </Field>
      <Field label="Contact email">
        {(p) => <Input {...p} type="email" name="contactPersonEmail" value={formData.contactPersonEmail} onChange={handleInputChange} disabled={!isVerified} placeholder="suresh@company.com" />}
      </Field>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Field label="City">
        {(p) => <Input {...p} name="city" value={formData.city} onChange={handleInputChange} disabled={!isVerified} placeholder="Ahmedabad" />}
      </Field>
      <Field label="State">
        {(p) => <Input {...p} name="state" value={formData.state} onChange={handleInputChange} disabled={!isVerified} placeholder="Gujarat" />}
      </Field>
      <Field label="Pincode">
        {(p) => <Input {...p} name="pincode" value={formData.pincode} onChange={handleInputChange} disabled={!isVerified} placeholder="380001" inputMode="numeric" />}
      </Field>
    </div>
  </StepCard>
);
