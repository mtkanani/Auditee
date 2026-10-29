import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { useConfirm } from '../../components/common/ConfirmProvider';

// Email → OTP → final warning. The code is valid for 5 minutes.
export const useDeleteAccount = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [step, setStep] = useState(1); // 1 = Email, 2 = Verify OTP, 3 = Confirmation Warning
  const [emailAddress, setEmailAddress] = useState(user?.email || '');
  const [submitting, setSubmitting] = useState(false);
  const [timer, setTimer] = useState(300);

  const form = useForm({
    mode: 'onTouched',
    defaultValues: { email: user?.email || '', otp: '' },
  });

  // Countdown timer effect
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOTP = async (data) => {
    setSubmitting(true);
    try {
      await authApi.sendDeleteOTP(data.email);
      setEmailAddress(data.email);
      setTimer(300);
      toast.success('Deletion OTP sent successfully! Please check your email.');
      setStep(2);
    } catch (error) {
      toast.error(error.message || 'Failed to request OTP. Is this email registered?');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOTP = async (data) => {
    if (timer === 0) {
      toast.error('OTP code has expired. Please request a new code.');
      return;
    }
    setSubmitting(true);
    try {
      await authApi.verifyDeleteOTP(emailAddress, data.otp);
      toast.success('OTP verified successfully! Please confirm deletion.');
      setStep(3);
    } catch (error) {
      toast.error(error.message || 'Invalid or incorrect OTP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    const ok = await confirm({
      title: 'Delete your account?',
      message: `The account for ${emailAddress} will be deleted and you will be signed out. This can't be undone.`,
      confirmText: 'Yes, delete',
    });
    if (!ok) return;
    setSubmitting(true);
    try {
      await authApi.deleteAccount(emailAddress);
      toast.success('Your account has been permanently deleted.');
      logout();
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to delete account. Session may have expired.');
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = (data) => {
    if (step === 1) handleSendOTP(data);
    else if (step === 2) handleVerifyOTP(data);
  };

  return {
    form,
    step,
    setStep,
    emailAddress,
    submitting,
    timer,
    onSubmit,
    resend: () => handleSendOTP({ email: emailAddress }),
    handleConfirmDelete,
    cancel: () => navigate('/user/profile'),
  };
};
