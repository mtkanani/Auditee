import React from 'react';
import { Check, Lock } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { Button } from '../../ui';
import { useAddMasterClientForm } from './useAddMasterClientForm';
import { VerificationBanner } from './VerificationBanner';
import { TaxVerificationSection } from './TaxVerificationSection';
import { ProfileSection } from './ProfileSection';
import { ContactSection } from './ContactSection';

export const AddMasterClientModal = ({ isOpen, onClose, onSuccess }) => {
  const form = useAddMasterClientForm({ isOpen, onClose, onSuccess });
  const { isVerified, handleCreateAccount, isCreating } = form;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add client" maxWidth="max-w-3xl">
      <div className="space-y-4">
        <VerificationBanner isVerified={isVerified} verificationResult={form.verificationResult} />

        <TaxVerificationSection {...form} />

        {/* Steps 2 and 3 stay locked until a tax ID is verified. */}
        <div className="relative">
          {!isVerified && (
            <div className="absolute inset-0 z-20 flex justify-center items-start pt-20 rounded-2xl bg-page/70 backdrop-blur-[2px]">
              <div className="flex flex-col items-center text-center px-6">
                <span className="grid place-items-center w-11 h-11 rounded-2xl bg-surface border border-line shadow-card text-muted mb-2">
                  <Lock className="w-5 h-5" aria-hidden="true" />
                </span>
                <p className="text-sm font-medium text-fg">Verify a tax ID first</p>
                <p className="text-xs text-muted max-w-xs">The profile and contact details unlock once the GSTIN or PAN checks out.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <ProfileSection {...form} />
            <ContactSection {...form} />

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="primary" icon={Check} loading={isCreating} disabled={!isVerified}>
                Create client
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
