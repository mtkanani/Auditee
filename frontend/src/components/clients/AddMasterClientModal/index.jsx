import React from 'react';
import { Modal } from '../../common/Modal';
import { Check, Lock, RefreshCw } from 'lucide-react';
import { useAddMasterClientForm } from './useAddMasterClientForm';
import { VerificationBanner } from './VerificationBanner';
import { TaxVerificationSection } from './TaxVerificationSection';
import { ProfileSection } from './ProfileSection';
import { ContactSection } from './ContactSection';

export const AddMasterClientModal = ({ isOpen, onClose, onSuccess }) => {
  const form = useAddMasterClientForm({ isOpen, onClose, onSuccess });
  const { isVerified, handleCreateAccount, isCreating } = form;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Master Client Account">
      <div className="space-y-6 max-h-[78vh] overflow-y-auto pr-1">
        {/* Verification Status Header Banner */}
        <VerificationBanner isVerified={isVerified} verificationResult={form.verificationResult} />

        {/* Section 1: Tax Registration & Verification */}
        <TaxVerificationSection {...form} />

        {/* Gating Lock Wrapper for Sections 2 & 3 */}
        <div className="relative">
          {!isVerified && (
            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] z-20 rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-slate-800">
              <div className="p-3 rounded-full bg-slate-900 border border-slate-700 text-amber-400 mb-3 shadow-xl">
                <Lock className="w-6 h-6"  />
              </div>
              <h4 className="text-sm font-bold text-slate-100 mb-1">Sections Locked</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Verify GSTIN or PAN in Section 1 above to unlock Client Profile & Contact Person details.
              </p>
            </div>
          )}

          <form onSubmit={handleCreateAccount} className="space-y-5">
            {/* Section 2: Entity & Account Profile Details */}
            <ProfileSection {...form} />

            {/* Section 3: Primary Contact & Address Details */}
            <ContactSection {...form} />

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={!isVerified || isCreating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin"  />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4"  />
                  <span>Create Master Client Account</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};
