import React from 'react';
import { Modal } from './Modal';
import { TriangleAlert } from 'lucide-react';
import { Button } from '../ui/Button';

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center">
        <span
          className={`grid place-items-center w-12 h-12 rounded-full mb-4 ${
            isDanger ? 'bg-danger-soft text-danger' : 'bg-warning-soft text-warning'
          }`}
        >
          <TriangleAlert className="w-6 h-6" aria-hidden="true" />
        </span>

        <p className="text-sm text-muted mb-6">{message}</p>

        <div className="flex flex-col-reverse sm:flex-row items-stretch gap-2 w-full">
          <Button variant="secondary" onClick={onClose} disabled={isLoading} className="flex-1">
            {cancelText}
          </Button>
          <Button variant={isDanger ? 'danger' : 'primary'} onClick={onConfirm} loading={isLoading} className="flex-1">
            {isLoading ? 'Working…' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
