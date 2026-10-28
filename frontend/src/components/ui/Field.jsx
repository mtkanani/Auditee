import React, { useId } from 'react';
import { ChevronDown, CircleAlert } from 'lucide-react';
import { cn } from '../../lib/cn';
import { controlClass } from './controlClass';

/**
 * Label + control + hint/error. Pass a render function to get the generated id and aria props:
 * <Field label="Email" error={errors.email?.message}>{(p) => <Input {...p} />}</Field>
 * or plain children (then pass id yourself).
 */
export const Field = ({ label, hint, error, required, className, children, id: idProp }) => {
  const autoId = useId();
  const id = idProp || autoId;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const controlProps = { id, invalid: Boolean(error), 'aria-describedby': describedBy };

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-fg">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      {typeof children === 'function' ? children(controlProps) : children}
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-xs font-medium text-danger">
          <CircleAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-xs text-subtle">
            {hint}
          </p>
        )
      )}
    </div>
  );
};

/** Text input. icon: optional lucide icon shown on the left. */
export const Input = ({ icon: Icon, invalid, className, ...props }) => (
  <div className="relative">
    {Icon && (
      <Icon className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
    )}
    <input
      aria-invalid={invalid || undefined}
      className={cn(controlClass(invalid), 'h-10 px-3', Icon && 'pl-9', className)}
      {...props}
    />
  </div>
);

export const Textarea = ({ invalid, className, rows = 3, ...props }) => (
  <textarea
    rows={rows}
    aria-invalid={invalid || undefined}
    className={cn(controlClass(invalid), 'px-3 py-2.5 resize-y min-h-[84px]', className)}
    {...props}
  />
);

/** Native select with the kit's styling. options: [{ value, label }] or pass <option> children. */
export const Select = ({ invalid, options, className, children, ...props }) => (
  <div className="relative">
    <select
      aria-invalid={invalid || undefined}
      className={cn(controlClass(invalid), 'h-10 pl-3 pr-9 appearance-none cursor-pointer', className)}
      {...props}
    >
      {options ? options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>) : children}
    </select>
    <ChevronDown className="w-4 h-4 text-subtle absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
  </div>
);
