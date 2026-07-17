import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, ShieldAlert, KeyRound } from 'lucide-react';

const ResetPasswordModal = ({ isOpen, onClose, onConfirm, adminEmail }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [strength, setStrength] = useState({ score: 0, text: 'Too Weak', color: 'bg-rose-500' });
  const [error, setError] = useState('');

  // Password Strength Calculation
  useEffect(() => {
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[a-z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    let text = 'Too Weak';
    let color = 'bg-rose-500';

    if (newPassword.length === 0) {
      score = 0;
    }

    if (score >= 5) {
      text = 'Very Strong';
      color = 'bg-emerald-500';
    } else if (score >= 4) {
      text = 'Strong';
      color = 'bg-teal-500';
    } else if (score >= 3) {
      text = 'Medium';
      color = 'bg-amber-500';
    } else if (score >= 1) {
      text = 'Weak';
      color = 'bg-rose-400';
    }

    setStrength({ score, text, color });
  }, [newPassword]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (strength.score < 4) {
      setError('Password is too weak. Please include uppercase, lowercase, numbers, and symbols.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    onConfirm(newPassword);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <KeyRound size={18} className="text-brand-400" />
            Reset Admin Password
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Info */}
        <div className="px-6 pt-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Admin User Email</span>
          <p className="text-sm font-semibold text-white mt-0.5">{adminEmail}</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="flex gap-2.5 items-start p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs mb-4">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* New Password */}
          <div className="mb-4 relative">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-4 pr-11 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-colors text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {newPassword.length > 0 && (
              <div className="mt-2.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Strength</span>
                  <span className="text-xs font-bold text-white">{strength.text}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-850 rounded-full overflow-hidden flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-full flex-1 transition-colors duration-305 ${
                        level <= strength.score ? strength.color : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6 relative">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full pl-4 pr-11 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-colors text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold border border-slate-800 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-500 transition-all shadow-glow-indigo/20"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
