import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { FiCheckCircle, FiShield, FiLock, FiUnlock, FiAlertCircle, FiCheck, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { firmAdminService } from '../../services/firmAdminService';

export const AddMasterClientModal = ({ isOpen, onClose, onSuccess }) => {
  const [isGstExempt, setIsGstExempt] = useState(false);
  const [gstNumberInput, setGstNumberInput] = useState('');
  const [panNumberInput, setPanNumberInput] = useState('');

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset modal state on open/close
  useEffect(() => {
    if (isOpen) {
      setIsGstExempt(false);
      setGstNumberInput('');
      setPanNumberInput('');
      setVerificationResult(null);
      setIsVerifying(false);
      setFormData({
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
      });
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerifyGst = async () => {
    const cleanGst = gstNumberInput.trim().toUpperCase();
    if (!cleanGst) {
      toast.error('Please enter a GSTIN number to verify');
      return;
    }

    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(cleanGst)) {
      toast.error('Invalid GSTIN format. Example: 24AAAAA0000A1Z5');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await firmAdminService.verifyGst(cleanGst);
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
        toast.success('⚡ GSTIN verified! Profile details auto-populated and sections unlocked.');
      } else {
        toast.error(res.message || 'GSTIN Verification failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'GST Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyPan = async () => {
    const cleanPan = panNumberInput.trim().toUpperCase();
    if (!cleanPan) {
      toast.error('Please enter a PAN number to verify');
      return;
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(cleanPan)) {
      toast.error('Invalid PAN format. Example: ABCDE1234F');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await firmAdminService.verifyPan(cleanPan);
      if (res.success && res.data) {
        setVerificationResult({
          type: 'PAN',
          data: res.data,
        });
        toast.success('⚡ PAN verified successfully! Account details sections unlocked.');
      } else {
        toast.error(res.message || 'PAN Verification failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'PAN Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!verificationResult || !verificationResult.data?.isVerified) {
      toast.error('Please verify GST or PAN details first');
      return;
    }

    if (!formData.clientName.trim()) {
      toast.error('Client name is required');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Account email is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        gstNumber: verificationResult.type === 'GST' ? verificationResult.data.gstNumber : null,
        panNumber: verificationResult.type === 'GST' ? verificationResult.data.panNumber : panNumberInput.trim().toUpperCase(),
        taxRegistrationType: isGstExempt ? 'EXEMPT' : 'REGULAR',
        isGstVerified: verificationResult.type === 'GST',
        isPanVerified: true,
      };

      await firmAdminService.createClient(payload);
      toast.success('Master Client Account created successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to create Master Client Account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isVerified = verificationResult && verificationResult.data?.isVerified;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Master Client Account">
      <div className="space-y-6 max-h-[78vh] overflow-y-auto pr-1">
        {/* Verification Status Header Banner */}
        <div
          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
            isVerified
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${
                isVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
              }`}
            >
              {isVerified ? <FiUnlock className="w-5 h-5" /> : <FiLock className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">
                {isVerified ? 'Tax Identity Verified & Unlocked' : 'Step 1: Mandatory Tax Verification'}
              </h4>
              <p className="text-[11px] opacity-80">
                {isVerified
                  ? `Verified via ${verificationResult.type} (${
                      verificationResult.type === 'GST'
                        ? verificationResult.data.gstNumber
                        : verificationResult.data.panNumber
                    })`
                  : 'Verify GSTIN or PAN below to unlock full account profile entry.'}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
              isVerified
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {isVerified ? 'Verified' : 'Gated / Locked'}
          </span>
        </div>

        {/* Section 1: Tax Registration & Verification */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                Tax Registration Identifiers & Verification
              </h3>
            </div>

            {/* Exemption Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isGstExempt}
                onChange={(e) => {
                  setIsGstExempt(e.target.checked);
                  setVerificationResult(null);
                }}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs font-medium text-amber-400">GST Exempt / Unregistered</span>
            </label>
          </div>

          {!isGstExempt ? (
            /* GST Verification Block */
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  GSTIN (15-Digit Goods & Services Tax Identification Number) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={gstNumberInput}
                    onChange={(e) => {
                      setGstNumberInput(e.target.value.toUpperCase());
                      if (isVerified) setVerificationResult(null);
                    }}
                    placeholder="e.g. 24AAAAA0000A1Z5"
                    maxLength={15}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-100 uppercase tracking-wider focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyGst}
                    disabled={isVerifying || !gstNumberInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                  >
                    {isVerifying ? (
                      <>
                        <FiRefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <FiShield className="w-4 h-4" />
                        <span>Verify GST</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* GST Verification Status Result */}
              {verificationResult?.type === 'GST' && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-900/50">
                    <span className="font-extrabold text-emerald-400 flex items-center gap-1.5 text-xs">
                      <FiCheckCircle className="w-4 h-4" />
                      GSTIN VERIFIED & ACTIVE ({verificationResult.data.gstNumber})
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {verificationResult.data.gstStatus || 'ACTIVE'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-slate-300">
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Legal Business Name</p>
                      <p className="font-extrabold text-slate-100 text-xs mt-0.5">{verificationResult.data.legalName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Trade / Brand Name</p>
                      <p className="font-bold text-slate-200 text-xs mt-0.5">{verificationResult.data.tradeName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Auto-Extracted PAN</p>
                      <p className="font-mono font-extrabold text-purple-300 text-xs mt-0.5">{verificationResult.data.panNumber}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">State & Jurisdiction</p>
                      <p className="font-bold text-slate-200 text-xs mt-0.5">Code {verificationResult.data.stateCode} ({verificationResult.data.stateName})</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Constitution Entity</p>
                      <p className="font-bold text-indigo-300 text-xs mt-0.5">{verificationResult.data.constitution || 'PRIVATE LIMITED'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Taxpayer Type</p>
                      <p className="font-bold text-emerald-400 text-xs mt-0.5">{verificationResult.data.taxpayerType || 'Regular'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* PAN Verification Block for Exempt Entities */
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  For small businesses or unregistered clients without GSTIN, valid <strong>PAN Verification</strong> is required to proceed.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  PAN Number (Permanent Account Number) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={panNumberInput}
                    onChange={(e) => {
                      setPanNumberInput(e.target.value.toUpperCase());
                      if (isVerified) setVerificationResult(null);
                    }}
                    placeholder="e.g. ABCDE1234F"
                    maxLength={10}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-100 uppercase tracking-wider focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyPan}
                    disabled={isVerifying || !panNumberInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
                  >
                    {isVerifying ? (
                      <>
                        <FiRefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <FiShield className="w-4 h-4" />
                        <span>Verify PAN</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* PAN Verification Result */}
              {verificationResult?.type === 'PAN' && (
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                      <FiCheckCircle className="w-4 h-4" />
                      PAN Card Verified Active
                    </span>
                    <span className="text-[10px] font-mono text-slate-300 font-bold">
                      {verificationResult.data.panNumber}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1 border-t border-emerald-900/50">
                    <div>
                      <p className="text-[10px] text-slate-400">Decoded Entity Category</p>
                      <p className="font-bold text-slate-100">{verificationResult.data.entityType}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Verification Record</p>
                      <p className="font-semibold text-emerald-300">{verificationResult.data.panStatus}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Gating Lock Wrapper for Sections 2 & 3 */}
        <div className="relative">
          {!isVerified && (
            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] z-20 rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-slate-800">
              <div className="p-3 rounded-full bg-slate-900 border border-slate-700 text-amber-400 mb-3 shadow-xl">
                <FiLock className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-100 mb-1">Sections Locked</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Verify GSTIN or PAN in Section 1 above to unlock Client Profile & Contact Person details.
              </p>
            </div>
          )}

          <form onSubmit={handleCreateAccount} className="space-y-5">
            {/* Section 2: Entity & Account Profile Details */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  Entity & Account Profile Details
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Client / Display Name *</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    disabled={!isVerified}
                    placeholder="e.g. Apex Tech Pvt Ltd"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Constitution Type *</label>
                  <select
                    name="clientType"
                    value={formData.clientType}
                    onChange={handleInputChange}
                    disabled={!isVerified}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
                  >
                    <option value="INDIVIDUAL">INDIVIDUAL</option>
                    <option value="PRIVATE_LIMITED">PRIVATE LIMITED</option>
                    <option value="PARTNERSHIP">PARTNERSHIP FIRM</option>
                    <option value="LLP">LLP</option>
                    <option value="PROPRIETORSHIP">PROPRIETORSHIP</option>
                    <option value="TRUST">TRUST / NGO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company Legal Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    disabled={!isVerified}
                    placeholder="Full Legal Name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Business Type / Industry</label>
                  <input
                    type="text"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    disabled={!isVerified}
                    placeholder="Manufacturing / IT / Services"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Account Email (Portal Login) *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isVerified}
                    placeholder="client@company.com"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={!isVerified}
                    placeholder="Password@123"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Primary Contact & Address Details */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  Primary Contact & Address Details
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Contact Name</label>
                  <input
                    type="text"
                    name="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={handleInputChange}
                    disabled={!isVerified}
                    placeholder="Mr. Suresh Patel"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    name="contactPersonDesignation"
                    value={formData.contactPersonDesignation}
                    onChange={handleInputChange}
                    disabled={!isVerified}
                    placeholder="Managing Director / CFO"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile / Phone</label>
                  <input
                    type="text"
                    name="contactPersonPhone"
                    value={formData.contactPersonPhone}
                    onChange={handleInputChange}
                    disabled={!isVerified}
                    placeholder="9988776655"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
                  <input
                    type="email"
                    name="contactPersonEmail"
                    value={formData.contactPersonEmail}
                    onChange={handleInputChange}
                    disabled={!isVerified}
                    placeholder="suresh@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!isVerified}
                    placeholder="Ahmedabad"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
                  />
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={!isVerified}
                    placeholder="Gujarat"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
                  />
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    disabled={!isVerified}
                    placeholder="380001"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={!isVerified || isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
            >
              {isSubmitting ? (
                <>
                  <FiRefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  <span>Create Master Client Account</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};
