import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/authApi';

export const useRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Steps: 1 = Email, 2 = Verify OTP, 3 = Complete Registration
  const [emailAddress, setEmailAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form setups
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      otp: '',
      firstName: '',
      lastName: '',
      mobileNumber: '',
      city: '',
      role: 'user',
      password: '',
      confirmPassword: '',
      confirmDetails: false,
    },
  });

  const passwordValue = watch('password');

  // Step 1: Send OTP
  const handleSendOTP = async (data) => {
    setSubmitting(true);
    try {
      await authApi.sendOTP(data.email);
      setEmailAddress(data.email);
      toast.success('OTP sent successfully! Please check your email.');
      setStep(2);
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (data) => {
    setSubmitting(true);
    try {
      await authApi.verifyOTP(emailAddress, data.otp);
      toast.success('OTP verified successfully! Please complete registration.');
      setStep(3);
    } catch (error) {
      toast.error(error.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3: Register user
  const handleRegisterUser = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        email: emailAddress, // Use the verified email
        password: data.password,
        confirmPassword: data.confirmPassword,
        city: data.city,
        role: data.role, // User selected role
      };

      await authApi.register(payload);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please check input parameters.');
    } finally {
      setSubmitting(false);
    }
  };

  // Master submit router depending on current active step
  const onSubmit = (data) => {
    if (step === 1) {
      handleSendOTP(data);
    } else if (step === 2) {
      handleVerifyOTP(data);
    } else if (step === 3) {
      handleRegisterUser(data);
    }
  };

  return {
    step,
    setStep,
    emailAddress,
    submitting,
    register,
    handleSubmit,
    errors,
    passwordValue,
    handleSendOTP,
    onSubmit,
  };
};
