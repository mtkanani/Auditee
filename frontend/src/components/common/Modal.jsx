import React, { useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Module-level stack for managing open modal instances
const modalStack = [];
let originalBodyOverflow = null;

function pushModal(modalId, onCloseHandler) {
  if (modalStack.length === 0) {
    originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  modalStack.push({ id: modalId, onClose: onCloseHandler });
}

function popModal(modalId) {
  const index = modalStack.findIndex((m) => m.id === modalId);
  if (index !== -1) {
    modalStack.splice(index, 1);
  }
  if (modalStack.length === 0) {
    document.body.style.overflow = originalBodyOverflow ?? '';
    originalBodyOverflow = null;
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalStack.length > 0) {
      e.stopPropagation();
      const topModal = modalStack[modalStack.length - 1];
      topModal.onClose?.();
    }
  });
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
  headerActions = null,
  footer = null,
  closeOnBackdrop = true,
}) => {
  const modalId = useId();
  const titleId = `${modalId}-title`;
  const previousActiveElement = useRef(null);
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement;
    pushModal(modalId, () => onCloseRef.current?.());

    // Focus management: focus first focusable element or the panel
    const focusTimer = setTimeout(() => {
      if (!panelRef.current) return;
      const focusableSelector =
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusableElements = Array.from(panelRef.current.querySelectorAll(focusableSelector)).filter(
        (el) => el.offsetParent !== null
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        panelRef.current.focus();
      }
    }, 50);

    return () => {
      clearTimeout(focusTimer);
      popModal(modalId);
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, modalId]);

  // Trap focus inside modal
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab' || !panelRef.current) return;

    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(panelRef.current.querySelectorAll(focusableSelector)).filter(
      (el) => el.offsetParent !== null
    );

    if (focusableElements.length === 0) {
      e.preventDefault();
      panelRef.current.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement || document.activeElement === panelRef.current) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container to ensure perfect centering without top clipping */}
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              onKeyDown={handleKeyDown}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className={`relative w-full ${maxWidth} bg-surface border border-line rounded-2xl shadow-raised overflow-hidden z-10 text-left my-8 outline-none`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-line bg-surface/95 backdrop-blur-xl sticky top-0 z-20">
                {/* min-w-0 lets long titles truncate instead of widening the dialog on phones */}
                <h3 id={titleId} className="min-w-0 flex-1 text-base font-semibold text-fg flex items-center gap-2">
                  {title}
                </h3>
                <div className="flex items-center gap-2 shrink-0">
                  {headerActions}
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="grid place-items-center w-8 h-8 rounded-lg text-subtle hover:text-fg hover:bg-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[75vh] overflow-y-auto">{children}</div>

              {/* Sticky Footer */}
              {footer && (
                <div className="px-6 py-4 border-t border-line bg-surface/95 backdrop-blur-xl sticky bottom-0 z-20">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
