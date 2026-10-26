import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { ConfirmationModal } from './ConfirmationModal';

const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDanger: true,
  });

  const resolverRef = useRef(null);

  const confirm = useCallback(({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDanger = true,
  } = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialogState({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        isDanger,
      });
    });
  }, []);

  const handleClose = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    resolverRef.current?.(false);
  };

  const handleConfirm = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    resolverRef.current?.(true);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmationModal
        isOpen={dialogState.isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={dialogState.title}
        message={dialogState.message}
        confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText}
        isDanger={dialogState.isDanger}
      />
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};
