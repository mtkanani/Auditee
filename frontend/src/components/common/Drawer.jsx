import React, { useEffect } from 'react';
import { usePresence } from '../../hooks/usePresence';
import { X } from 'lucide-react';

export const Drawer = ({ isOpen, onClose, title, children, width = 'max-w-md' }) => {
  const { mounted, state } = usePresence(isOpen, 200);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    mounted && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div data-state={state} onClick={onClose} className="overlay fixed inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div
              data-state={state}
              className={`drawer-panel w-screen ${width} bg-surface border-l border-line shadow-raised flex flex-col`}
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
            </div>
          </div>
        </div>
      )
  );
};
