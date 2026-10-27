import React from 'react';
import { useFirmForm } from './useFirmForm';
import { FirmDetailsSection } from './FirmDetailsSection';
import { AdminDetailsSection } from './AdminDetailsSection';

const FirmForm = ({ onSubmit, defaultValues = null, isEdit = false, onCancel }) => {
  const form = useFirmForm({ onSubmit, defaultValues, isEdit });
  const { handleSubmit, onFormSubmit, isSubmitting } = form;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      
      {/* ── SECTION 1: Firm Details ── */}
      <FirmDetailsSection {...form} />

      {/* ── SECTION 2: Firm Admin Details ── */}
      <AdminDetailsSection {...form} isEdit={isEdit} />

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3.5 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-5 py-2.5 font-bold text-sm text-slate-300 border border-slate-850 hover:bg-slate-900 rounded-xl transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 font-bold text-sm text-white bg-brand-600 rounded-xl hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-250 flex items-center gap-2"
        >
          {isSubmitting ? 'Processing...' : isEdit ? 'Save Changes' : 'Create Firm'}
        </button>
      </div>
    </form>
  );
};

export default FirmForm;
