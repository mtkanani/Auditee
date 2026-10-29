import React from 'react';
import { ArrowLeft, ArrowRight, Mail, RefreshCw, ShieldCheck, Trash2, TriangleAlert } from 'lucide-react';
import { Button, Card, Field, Input, PageHeader } from '../../components/ui';
import { StepTracker } from '../../components/ui/StepTracker';
import { useDeleteAccount } from './useDeleteAccount';

const formatTime = (time) => `${String(Math.floor(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`;

const DeleteAccount = () => {
  const { form, step, setStep, emailAddress, submitting, timer, onSubmit, resend, handleConfirmDelete, cancel } = useDeleteAccount();
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <div className="space-y-6 max-w-xl">
      <PageHeader title="Delete account" description="Permanently delete your account and personal data." />

      <Card>
        <StepTracker step={step} steps={['Email', 'Code', 'Confirm']} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {step === 1 && (
            <>
              <p className="text-sm text-muted">Confirm your email address and we'll send you a 6-digit code.</p>
              <Field label="Email address" required error={errors.email?.message}>
                {(p) => (
                  <Input
                    {...p}
                    type="email"
                    icon={Mail}
                    autoComplete="email"
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address format' },
                    })}
                  />
                )}
              </Field>
              <Button type="submit" variant="primary" iconRight={ArrowRight} loading={submitting} className="w-full">
                Send code
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-muted">
                Enter the code sent to <strong className="text-fg font-medium">{emailAddress}</strong>.
              </p>
              <Field label="Verification code" required error={errors.otp?.message}>
                {(p) => (
                  <Input
                    {...p}
                    icon={ShieldCheck}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    className="font-mono tracking-[0.3em]"
                    {...register('otp', {
                      required: 'OTP code is required',
                      pattern: { value: /^[0-9]{6}$/, message: 'OTP must be exactly 6 digits' },
                    })}
                  />
                )}
              </Field>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted" aria-live="polite">
                  {timer > 0 ? (
                    <>
                      Expires in <span className={`font-mono tabular-nums ${timer <= 30 ? 'text-danger' : 'text-fg'}`}>{formatTime(timer)}</span>
                    </>
                  ) : (
                    <span className="text-danger">Code expired</span>
                  )}
                </span>
                <Button type="button" size="sm" variant="ghost" icon={RefreshCw} disabled={submitting} onClick={resend}>
                  Resend code
                </Button>
              </div>

              <div className="flex gap-2 pt-4 border-t border-line">
                <Button type="button" variant="ghost" icon={ArrowLeft} disabled={submitting} onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" variant="primary" loading={submitting} className="flex-1">
                  Verify code
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="p-4 rounded-xl bg-danger-soft border border-danger/30">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-danger mb-1.5">
                  <TriangleAlert className="w-4 h-4" aria-hidden="true" />
                  This can't be undone
                </h2>
                <p className="text-sm text-muted">Your profile, sign-in sessions and settings will be permanently deleted.</p>
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t border-line">
                <Button type="button" variant="ghost" disabled={submitting} onClick={cancel}>
                  Cancel
                </Button>
                <Button type="button" variant="danger" icon={Trash2} loading={submitting} onClick={handleConfirmDelete}>
                  Delete account
                </Button>
              </div>
            </>
          )}
        </form>
      </Card>
    </div>
  );
};

export default DeleteAccount;
