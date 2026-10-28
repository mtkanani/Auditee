import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

const variants = {
  // Signature gradient; the one prominent action per view.
  primary:
    'text-on-accent bg-gradient-to-r from-accent to-accent-2 shadow-glow hover:brightness-110 active:brightness-95',
  secondary:
    'bg-surface text-fg border border-line shadow-card hover:bg-hover hover:border-line-strong',
  ghost: 'text-muted hover:text-fg hover:bg-hover',
  soft: 'bg-accent-soft text-accent-fg hover:brightness-110',
  danger: 'bg-danger-soft text-danger border border-transparent hover:border-danger/40',
};

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-11 px-5 text-sm gap-2 rounded-xl',
  icon: 'h-9 w-9 rounded-xl',
  'icon-sm': 'h-8 w-8 rounded-lg',
};

/**
 * Button. variant: primary | secondary | ghost | soft | danger; size: sm | md | lg | icon | icon-sm.
 * Icon-only buttons (size icon / icon-sm) need an aria-label.
 */
export const Button = ({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={cn(
      'inline-flex items-center justify-center font-medium whitespace-nowrap select-none',
      'transition-all duration-150 active:scale-[0.98]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-page',
      'disabled:opacity-50 disabled:pointer-events-none',
      variants[variant],
      sizes[size],
      className
    )}
    {...props}
  >
    {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
    {children}
    {IconRight && !loading && <IconRight className="w-4 h-4" aria-hidden="true" />}
  </button>
);
