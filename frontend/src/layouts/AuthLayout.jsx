import React from 'react';
import { Outlet } from 'react-router-dom';
import { CalendarCheck, FolderLock, ReceiptIndianRupee } from 'lucide-react';

const FEATURES = [
  { icon: CalendarCheck, text: 'GST, TDS and ROC deadlines tracked for every client' },
  { icon: ReceiptIndianRupee, text: 'GST invoices, payments and outstanding fees in one place' },
  { icon: FolderLock, text: 'A secure document vault your clients can use too' },
];

const Logo = ({ className = '' }) => (
  <span
    className={`grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-on-accent text-lg font-bold shadow-glow ${className}`}
    aria-hidden="true"
  >
    A
  </span>
);

/**
 * Sign-in, sign-up and password screens. Wide screens get a brand panel beside the form;
 * phones get a single card. title/subtitle are optional (pages can render their own heading).
 */
export const AuthLayout = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-page text-fg lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
    {/* Brand panel (wide screens only) */}
    <aside className="hidden lg:flex relative overflow-hidden flex-col justify-between p-12 bg-gradient-to-br from-accent via-accent to-accent-2 text-white">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] rounded-full bg-black/10 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative flex items-center gap-3">
        <span className="grid place-items-center w-11 h-11 rounded-2xl bg-white/15 ring-1 ring-white/25 text-lg font-bold" aria-hidden="true">A</span>
        <span className="text-lg font-semibold tracking-tight">Auditee</span>
      </div>

      <div className="relative max-w-md">
        <h1 className="text-3xl xl:text-4xl font-semibold leading-tight tracking-tight">Run your CA practice from one calm place.</h1>
        <ul className="mt-8 space-y-4">
          {FEATURES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-white/90">
              <span className="grid place-items-center w-8 h-8 rounded-xl bg-white/15 shrink-0">
                <Icon className="w-4 h-4" aria-hidden="true" />
              </span>
              <span className="pt-1 text-sm leading-relaxed">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-white/70">Practice management for chartered accountant firms</p>
    </aside>

    {/* Form side */}
    <main className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-8 overflow-hidden">
      <div className="lg:hidden absolute -top-32 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-accent/15 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-line bg-surface shadow-raised p-6 sm:p-8 lg:border-0 lg:bg-transparent lg:shadow-none lg:p-0">
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <Logo />
            <span className="text-lg font-semibold tracking-tight">Auditee</span>
          </div>

          {(title || subtitle) && (
            <div className="mb-6">
              {title && <h2 className="text-2xl font-semibold tracking-tight text-fg">{title}</h2>}
              {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
            </div>
          )}

          {children ? children : <Outlet />}
        </div>
      </div>
    </main>
  </div>
);

export default AuthLayout;
