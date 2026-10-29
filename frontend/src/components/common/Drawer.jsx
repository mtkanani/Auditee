import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Drawer = ({ isOpen, onClose, title, children, width = 'max-w-md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`w-screen ${width} bg-surface border-l border-line shadow-raised flex flex-col`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-line">
                <h3 className="text-base font-semibold text-fg min-w-0 truncate">{title}</h3>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="p-1.5 rounded-lg text-muted hover:text-fg hover:bg-hover transition-colors shrink-0"
                >
                  <X className="w-5 h-5"  />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 overflow-y-auto">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
