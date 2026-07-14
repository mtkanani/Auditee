import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Lock, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import DashboardLayout from '../../layouts/DashboardLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

const ChangePassword = () => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // API call requires: email, currentPassword, newPassword
      await authApi.changePassword(user.email, data.currentPassword, data.newPassword);
      
      toast.success('Password changed successfully!', {
        position: 'top-right',
        autoClose: 3500,
        theme: 'dark',
      });
      
      // Reset form fields
      reset();
    } catch (error) {
      toast.error(error.message || 'Failed to change password. Is your current password correct?', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Change Password">
      <div className="glass-panel p-8 rounded-2xl shadow-glass-md border border-slate-800/80 max-w-xl">
        <div className="mb-6">
          <h3 className="text-xl font-bold font-sans text-white">Update Your Password</h3>
          <p className="text-sm text-slate-400 mt-1">
            Choose a strong password containing letters, numbers, and special characters.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password */}
          <InputField
            label="Current Password"
            name="currentPassword"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.currentPassword}
            {...register('currentPassword', {
              required: 'Current password is required',
            })}
          />

          {/* New Password */}
          <InputField
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.newPassword}
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              validate: {
                hasUpper: (val) => /[A-Z]/.test(val) || 'Must contain at least 1 uppercase letter',
                hasLower: (val) => /[a-z]/.test(val) || 'Must contain at least 1 lowercase letter',
                hasNumber: (val) => /[0-9]/.test(val) || 'Must contain at least 1 number',
                hasSpecial: (val) => /[^A-Za-z0-9]/.test(val) || 'Must contain at least 1 special character',
              },
            })}
          />

          {/* Submit Action */}
          <div className="border-t border-slate-800/60 pt-6 flex justify-end">
            <Button
              type="submit"
              loading={submitting}
              fullWidth={false}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              <span>Change Password</span>
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ChangePassword;
