import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useVerifyGst, useVerifyPan, useCreateClient } from '../../../queries/useClients';
import { mapCreateClientErrors } from './mapCreateClientErrors';

const EMPTY_FORM = {
  clientName: '',
  clientType: 'INDIVIDUAL',
  companyName: '',
  businessType: '',
  email: '',
  password: '',
  phone: '',
  contactPersonName: '',
  contactPersonDesignation: '',
  contactPersonPhone: '',
  contactPersonEmail: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  tanNumber: '',
  cinNumber: '',
};

export const useAddMasterClientForm = ({ isOpen, onClose, onSuccess }) => {
  const [isGstExempt, setIsGstExempt] = useState(false);
  const [gstNumberInput, setGstNumberInput] = useState('');
  const [panNumberInput, setPanNumberInput] = useState('');

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const verifyGstMutation = useVerifyGst();
  const verifyPanMutation = useVerifyPan();
  const createClientMutation = useCreateClient();

  // Form State
  const [formData, setFormData] = useState(EMPTY_FORM);

  const [fieldErrors, setFieldErrors] = useState({});

  // Reset modal state on open/close
  useEffect(() => {
    if (isOpen) {
      setIsGstExempt(false);
      setGstNumberInput('');
      setPanNumberInput('');
      setVerificationResult(null);
      setIsVerifying(false);
      setFieldErrors({});
      setFormData(EMPTY_FORM);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleVerifyGst = () => {
    const cleanGst = gstNumberInput.trim().toUpperCase();
    setFieldErrors((prev) => ({ ...prev, gstNumberInput: null }));

    if (!cleanGst) {
      setFieldErrors((prev) => ({ ...prev, gstNumberInput: 'Please enter a GSTIN number to verify' }));
      toast.error('Please enter a GSTIN number to verify');
      return;
    }

    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(cleanGst)) {
      setFieldErrors((prev) => ({ ...prev, gstNumberInput: 'Invalid GSTIN format. Example: 24AAAAA0000A1Z5' }));
      toast.error('Invalid GSTIN format. Example: 24AAAAA0000A1Z5');
      return;
    }

    setIsVerifying(true);
    verifyGstMutation.mutate(cleanGst, {
      onSuccess: (res) => {
        setIsVerifying(false);
        if (res.success && res.data) {
          setVerificationResult({
            type: 'GST',
            data: res.data,
          });
          // Auto-fill extracted values into profile form fields
          setFormData((prev) => ({
            ...prev,
            clientName: res.data.legalName || res.data.tradeName || prev.clientName,
            companyName: res.data.legalName || res.data.tradeName || prev.companyName,
            clientType: res.data.constitution || prev.clientType,
            state: res.data.stateName || prev.state,
          }));
          toast.success('⚡ GSTIN Verified! Account details unlocked & auto-filled.');
        } else {
          toast.error(res.message || 'GST Verification failed');
        }
      },
      onError: (err) => {
        setIsVerifying(false);
        toast.error(err.response?.data?.message || err.message || 'GST Verification failed');
      },
    });
  };

  const handleVerifyPan = () => {
    const cleanPan = panNumberInput.trim().toUpperCase();
    setFieldErrors((prev) => ({ ...prev, panNumberInput: null }));

    if (!cleanPan) {
      setFieldErrors((prev) => ({ ...prev, panNumberInput: 'Please enter a PAN number to verify' }));
      toast.error('Please enter a PAN number to verify');
      return;
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(cleanPan)) {
      setFieldErrors((prev) => ({ ...prev, panNumberInput: 'Invalid PAN format. Example: ABCDE1234F' }));
      toast.error('Invalid PAN format. Example: ABCDE1234F');
      return;
    }

    setIsVerifying(true);
    verifyPanMutation.mutate(cleanPan, {
      onSuccess: (res) => {
        setIsVerifying(false);
        if (res.success && res.data) {
          setVerificationResult({
            type: 'PAN',
            data: res.data,
          });
          toast.success('⚡ PAN verified successfully! Account details sections unlocked.');
        } else {
          toast.error(res.message || 'PAN Verification failed');
        }
      },
      onError: (err) => {
        setIsVerifying(false);
        toast.error(err.response?.data?.message || err.message || 'PAN Verification failed');
      },
    });
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    setFieldErrors({});

    if (!verificationResult || !verificationResult.data?.isVerified) {
      toast.error('Please verify GST or PAN details first in Section 1');
      return;
    }

    const errors = {};

    // 1. Client Display Name Validation
    if (!formData.clientName.trim()) {
      errors.clientName = 'Client display / business name is required';
    }

    // 2. Account Email (Gmail) Validation
    const emailStr = formData.email.trim();
    if (!emailStr) {
      errors.email = 'Account Email (Gmail / Login Email) is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
      errors.email = 'Invalid Gmail / Email format (e.g. client@gmail.com)';
    }

    // 3. Password Validation
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Initial password must be at least 6 characters long';
    }

    // 4. Contact Phone Validation
    const phoneStr = (formData.contactPersonPhone || formData.phone || '').trim();
    if (phoneStr && !/^[0-9+\-\s]{8,15}$/.test(phoneStr)) {
      errors.contactPersonPhone = 'Mobile number must be a valid 10-digit phone number';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error('Please fix the highlighted form errors below');
      return;
    }

    const payload = {
      ...formData,
      phone: formData.phone || formData.contactPersonPhone,
      gstNumber: verificationResult.type === 'GST' ? verificationResult.data.gstNumber : null,
      panNumber: verificationResult.type === 'GST' ? verificationResult.data.panNumber : panNumberInput.trim().toUpperCase(),
      taxRegistrationType: isGstExempt ? 'EXEMPT' : 'REGULAR',
      isGstVerified: verificationResult.type === 'GST',
      isPanVerified: true,
    };

    createClientMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('⚡ Master Client Account created successfully!');
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (err) => {
        console.error('Create Client Error:', err);
        const serverMsg = err.response?.data?.message || err.message || '';
        const serverErrors = err.response?.data?.errors || {};
        const newFieldErrors = mapCreateClientErrors(serverMsg, serverErrors);

        if (Object.keys(newFieldErrors).length > 0) {
          setFieldErrors(newFieldErrors);
        }

        toast.error(serverMsg || 'Failed to create Master Client Account');
      },
    });
  };

  const isVerified = verificationResult && verificationResult.data?.isVerified;

  return {
    isGstExempt,
    setIsGstExempt,
    gstNumberInput,
    setGstNumberInput,
    panNumberInput,
    setPanNumberInput,
    isVerifying,
    verificationResult,
    setVerificationResult,
    formData,
    fieldErrors,
    setFieldErrors,
    handleInputChange,
    handleVerifyGst,
    handleVerifyPan,
    handleCreateAccount,
    isVerified,
    isCreating: createClientMutation.isPending,
  };
};
