import React from 'react';
import { useFirmForm } from './useFirmForm';
import { FirmDetailsSection } from './FirmDetailsSection';
import { AdminDetailsSection } from './AdminDetailsSection';
import { Button } from '../../ui';

const FirmForm = ({ onSubmit, defaultValues = null, isEdit = false, onCancel }) => {
  const form = useFirmForm({ onSubmit, defaultValues, isEdit });
  const { handleSubmit, onFormSubmit, isSubmitting } = form;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      
      {/* ── SECTION 1: Firm Details ── */}
      <FirmDetailsSection {...form} />

      {/* ── SECTION 2: Firm Admin Details ── */}
      <AdminDetailsSection {...form} isEdit={isEdit} />

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create firm'}
        </Button>
      </div>
    </form>
  );
};

export default FirmForm;
