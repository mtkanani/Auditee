import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

/**
 * Dropdown menu. trigger is a render function receiving button props:
 *   <Menu trigger={(p) => <Button {...p}>Open</Button>}>{(close) => <MenuItem onClick={close}>..</MenuItem>}</Menu>
 * Closes on outside click, Escape, or when children call close().
 */
export const Menu = ({ trigger, align = 'right', width = 'w-56', className, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={ref} className="relative">
      {trigger({ onClick: () => setOpen((v) => !v), 'aria-expanded': open, 'aria-haspopup': 'menu' })}
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute top-full mt-2 z-50 p-1.5 rounded-2xl bg-surface border border-line shadow-raised animate-fade-in',
            align === 'right' ? 'right-0' : 'left-0',
            width,
            className
          )}
        >
          {typeof children === 'function' ? children(close) : children}
        </div>
      )}
    </div>
  );
};

/** Row inside a Menu. tone 'danger' for destructive actions. */
export const MenuItem = ({ icon: Icon, tone, hint, className, children, ...props }) => (
  <button
    type="button"
    role="menuitem"
    className={cn(
      'w-full flex items-center gap-2.5 px-2.5 h-9 rounded-xl text-sm text-left transition-colors',
      'focus-visible:outline-none focus-visible:bg-hover',
      tone === 'danger' ? 'text-danger hover:bg-danger-soft' : 'text-fg hover:bg-hover',
      className
    )}
    {...props}
  >
    {Icon && <Icon className={cn('w-4 h-4 shrink-0', tone === 'danger' ? '' : 'text-muted')} aria-hidden="true" />}
    <span className="flex-1 truncate">{children}</span>
    {hint && <span className="text-xs text-subtle">{hint}</span>}
  </button>
);

export const MenuLabel = ({ children }) => (
  <p className="px-2.5 pt-2 pb-1 text-xs font-medium text-subtle">{children}</p>
);

export const MenuDivider = () => <div className="my-1.5 h-px bg-line" role="separator" />;
