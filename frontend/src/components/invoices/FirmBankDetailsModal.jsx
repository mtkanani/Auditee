import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../common/Modal';
import { Skeleton } from '../common/Skeleton';
import { Button, Field, Input, Textarea } from '../ui';
import { useBankDetails, useUpdateFirmBankDetails } from '../../queries/useInvoices';

export const FirmBankDetailsModal = ({ isOpen, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    branchName: '',
    upiId: '',
    notes: '',
  });

  const { bankDetails, isLoading: loading, error } = useBankDetails({ enabled: isOpen });
  const updateBankMutation = useUpdateFirmBankDetails();

  useEffect(() => {
    if (bankDetails) {
      setFormData({
        bankName: bankDetails.bankName || '',
        accountNumber: bankDetails.accountNumber || '',
        ifscCode: bankDetails.ifscCode || '',
        accountHolderName: bankDetails.accountHolderName || '',
        branchName: bankDetails.branchName || '',
        upiId: bankDetails.upiId || '',
        notes: bankDetails.notes || '',
      });
    }
  }, [bankDetails]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load firm bank details.');
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBankMutation.mutate(formData, {
      onSuccess: () => {
        if (onSaved) onSaved();
        onClose();
      },
    });
  };

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bank and payment details" maxWidth="max-w-xl">
      {loading ? (
        <div className="space-y-4" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-sm text-muted">Printed on every invoice so clients know where to pay.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Account holder" required>
              {(p) => <Input {...p} required placeholder="e.g. Codelix CA Firm" value={formData.accountHolderName} onChange={set('accountHolderName')} />}
            </Field>
            <Field label="Bank" required>
              {(p) => <Input {...p} required placeholder="e.g. ICICI Bank" value={formData.bankName} onChange={set('bankName')} />}
            </Field>
            <Field label="Account number" required>
              {(p) => <Input {...p} required placeholder="e.g. 987654321012" value={formData.accountNumber} onChange={set('accountNumber')} className="font-mono" />}
            </Field>
            <Field label="IFSC code" required>
              {(p) => <Input {...p} required placeholder="e.g. ICIC0001234" value={formData.ifscCode} onChange={set('ifscCode')} className="font-mono uppercase" />}
            </Field>
            <Field label="Branch">
              {(p) => <Input {...p} placeholder="e.g. Vejalpur, Ahmedabad" value={formData.branchName} onChange={set('branchName')} />}
            </Field>
            <Field label="UPI ID" required>
              {(p) => <Input {...p} required placeholder="e.g. codelix.ca@okicici" value={formData.upiId} onChange={set('upiId')} className="font-mono" />}
            </Field>
          </div>

          <Field label="Payment instructions for clients">
            {(p) => (
              <Textarea
                {...p}
                rows={2}
                placeholder="e.g. Please quote the invoice number on every NEFT, RTGS or UPI transfer."
                value={formData.notes}
                onChange={set('notes')}
              />
            )}
          </Field>

          <div className="pt-4 border-t border-line flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" icon={Save} loading={updateBankMutation.isPending}>Save details</Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default FirmBankDetailsModal;
