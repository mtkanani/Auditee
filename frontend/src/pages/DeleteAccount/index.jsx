import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Shield, AlertTriangle, ArrowRight, ArrowLeft, Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import DashboardLayout from '../../layouts/DashboardLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

const DeleteAccount = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = Email, 2 = Verify OTP, 3 = Confirmation Warning
  const [emailAddress, setEmailAddress] = useState(user?.email || '');
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // OTP Timer State (5 minutes = 300 seconds)
  const [timer, setTimer] = useState(300);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      email: user?.email || '',
      otp: '',
    },
  });

  // Countdown timer effect
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Format seconds to MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Step 1: Send OTP
  const handleSendOTP = async (data) => {
    setSubmitting(true);
    try {
      await authApi.sendDeleteOTP(data.email);
      setEmailAddress(data.email);
      setTimer(300); // Reset timer
      toast.success('Deletion OTP sent successfully! Please check your email.', {
        position: 'top-right',
        autoClose: 3500,
        theme: 'dark',
      });
      setStep(2);
    } catch (error) {
      toast.error(error.message || 'Failed to request OTP. Is this email registered?', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (data) => {
    if (timer === 0) {
      toast.error('OTP code has expired. Please request a new code.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
      return;
    }

    setSubmitting(true);
    try {
      await authApi.verifyDeleteOTP(emailAddress, data.otp);
      toast.success('OTP verified successfully! Please confirm deletion.', {
        position: 'top-right',
        autoClose: 3500,
        theme: 'dark',
      });
      setStep(3);
    } catch (error) {
      toast.error(error.message || 'Invalid or incorrect OTP. Please try again.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3: Trigger Permanent Deletion
  const handleConfirmDelete = async () => {
    setSubmitting(true);
    try {
      await authApi.deleteAccount(emailAddress);
      
      toast.success('Your account has been permanently deleted.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
      
      // Close confirmation modal
      setShowModal(false);
      
      // Clear token and logout states
      logout();
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to delete account. Session may have expired.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = (data) => {
    if (step === 1) {
      handleSendOTP(data);
    } else if (step === 2) {
      handleVerifyOTP(data);
    }
  };

  return (
    <DashboardLayout title="Delete Account">
      <div className="glass-panel p-8 rounded-2xl shadow-glass-md border border-slate-800/80 max-w-xl">
        
        {/* Header warning indicator */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-slate-800/60 mb-6 text-rose-500">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold font-sans">Danger Zone</h3>
            <p className="text-xs text-slate-400 mt-0.5">Permanently delete your user account and data</p>
          </div>
        </div>

        {/* Visual Stepper Tracker */}
        <div className="flex items-center justify-between mb-8 px-8">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className="flex flex-col items-center">
                <div 
                  className={`
                    w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-300
                    ${step === num 
                      ? 'bg-rose-500 text-white shadow-glow-rose/25 border border-rose-400' 
                      : step > num 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : 'bg-slate-900 text-slate-500 border border-slate-800'}
                  `}
                >
                  {step > num ? '✓' : num}
                </div>
              </div>
              {num < 3 && (
                <div 
                  className={`
                    flex-1 h-0.5 mx-2 rounded transition-all duration-300
                    ${step > num ? 'bg-emerald-500/40' : 'bg-slate-800'}
                  `}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Step 1: Input Email */}
          {step === 1 && (
            <div className="animate-fade-in space-y-4">
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                To initiate account deletion, verify your email address. We will send you a 6-digit OTP code.
              </p>

              <InputField
                label="Confirm Email Address"
                name="email"
                type="email"
                placeholder="name@example.com"
                icon={Mail}
                error={errors.email}
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address format',
                  },
                })}
              />

              <Button
                type="submit"
                loading={submitting}
                className="mt-6 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 focus:ring-rose-500 border-none"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>Request Deletion OTP</span>
                  <ArrowRight size={16} />
                </span>
              </Button>
            </div>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <div className="animate-fade-in space-y-4">
              <p className="text-sm text-slate-400 leading-relaxed">
                Enter the security code sent to **{emailAddress}** to authenticate deletion.
              </p>

              <InputField
                label="Verification OTP"
                name="otp"
                type="text"
                placeholder="000000"
                icon={Shield}
                maxLength={6}
                error={errors.otp}
                {...register('otp', {
                  required: 'OTP code is required',
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: 'OTP must be exactly 6 digits',
                  },
                })}
              />

              {/* OTP Timer & Resend Option */}
              <div className="flex items-center justify-between text-xs py-2 px-1 text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  Code expires in:{' '}
                  <span className={`font-mono text-sm ${timer <= 30 ? 'text-rose-500 font-bold animate-pulse' : 'text-brand-400'}`}>
                    {formatTime(timer)}
                  </span>
                </span>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleSendOTP({ email: emailAddress })}
                  className="font-semibold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1.5 focus:outline-none"
                >
                  <RefreshCw size={12} className={submitting ? 'animate-spin' : ''} />
                  <span>Resend OTP</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 border-t border-slate-800/60 pt-6">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={submitting}
                  onClick={() => setStep(1)}
                  fullWidth={false}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </Button>
                
                <Button
                  type="submit"
                  loading={submitting}
                  className="flex-1"
                >
                  <span>Verify OTP</span>
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Warn Card & Confirm Modal */}
          {step === 3 && (
            <div className="animate-fade-in space-y-6">
              
              {/* Warning box */}
              <div className="bg-rose-500/10 border border-rose-500/25 p-5 rounded-xl text-rose-200">
                <h4 className="text-md font-bold flex items-center gap-2 mb-2 text-rose-400">
                  <AlertTriangle size={18} />
                  <span>Delete Account Permanently?</span>
                </h4>
                <p className="text-sm leading-relaxed text-slate-300">
                  This action **cannot be undone**. All your profile data, session tokens, and configurations will be permanently purged from our PostgreSQL database.
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t border-slate-800/60 pt-6">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={submitting}
                  onClick={() => navigate('/profile')}
                  fullWidth={false}
                >
                  Cancel
                </Button>
                
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => setShowModal(true)}
                  fullWidth={false}
                  className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 border-none"
                >
                  <Trash2 size={16} />
                  <span>Delete Account</span>
                </Button>
              </div>
            </div>
          )}
        </form>

      </div>

      {/* Double confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel p-8 rounded-2xl shadow-glass-lg max-w-sm w-full border border-rose-500/20 text-center animate-slide-up">
            
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto mb-4 animate-pulse">
              <AlertTriangle size={28} />
            </div>

            <h4 className="text-lg font-bold text-white mb-2">Are you absolutely sure?</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              This will permanently delete the account for **{emailAddress}**. You will be logged out immediately.
            </p>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                disabled={submitting}
                onClick={() => setShowModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              
              <Button
                type="button"
                variant="danger"
                loading={submitting}
                onClick={handleConfirmDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-500 border-none"
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DeleteAccount;
