import React from 'react';
import { Field, Input } from '../../ui';

/** Titled group of fields inside the firm form. */
export const FormSection = ({ icon: Icon, title, children }) => (
  <section className="rounded-2xl border border-line bg-sunken/30 p-5">
    <h3 className="flex items-center gap-2 text-sm font-semibold text-fg mb-4">
      <Icon className="w-4 h-4 text-accent-fg" aria-hidden="true" />
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </section>
);

/** One registered text field. rules are react-hook-form register() rules. */
export const TextField = ({ register, name, label, error, rules, type = 'text', wide, ...inputProps }) => (
  <Field label={label} required={Boolean(rules?.required)} error={error} className={wide ? 'md:col-span-2' : undefined}>
    {(p) => <Input {...p} type={type} {...inputProps} {...register(name, rules)} />}
  </Field>
);
