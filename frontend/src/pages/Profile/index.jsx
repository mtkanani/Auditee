import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User, Phone, MapPin, Mail, ShieldAlert, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/userApi';
import DashboardLayout from '../../layouts/DashboardLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

const Profile = () => {
  const { user, updateUserState, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync React Hook Form values whenever user data changes or edit mode toggles
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });

  // Re-load form values when editing triggers
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        mobileNumber: user.mobileNumber || '',
        city: user.city || '',
      });
    }
  }, [user, isEditing, reset]);

  const onEdit = () => {
    setIsEditing(true);
  };

  const onCancel = () => {
    setIsEditing(false);
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      // updateProfile requires: userId, and updateData
      const response = await userApi.updateProfile(user.id, data);
      
      // Update AuthContext state
      updateUserState(response.data);
      
      toast.success('Profile updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      });
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile. Mobile number may be in use.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="User Profile">
      <div className="glass-panel p-8 rounded-2xl shadow-glass-md border border-slate-800/80">
        
        {/* Profile Card Header */}
        <div className="flex flex-col tablet:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/60 mb-6">
          <div className="flex flex-col tablet:flex-row items-center gap-4 text-center tablet:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-glow-indigo/25">
              {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-2xl font-bold font-sans text-white">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-slate-400 mt-1">{user?.email}</p>
              
              <div className="flex flex-wrap gap-2 mt-2 justify-center tablet:justify-start">
                <span className="text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-400 px-2.5 py-1 rounded-md border border-brand-500/25">
                  {user?.role || 'User'}
                </span>
                {user?.isVerified && (
                  <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-500/25">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {!isEditing && (
            <Button
              type="button"
              variant="secondary"
              fullWidth={false}
              onClick={onEdit}
              className="flex items-center gap-2"
            >
              <Edit size={16} />
              <span>Edit Profile</span>
            </Button>
          )}
        </div>

        {/* Details Grid Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-x-6 gap-y-2">
            
            {/* First Name */}
            {isEditing ? (
              <InputField
                label="First Name"
                name="firstName"
                placeholder="First Name"
                icon={User}
                error={errors.firstName}
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: { value: 2, message: 'Min 2 characters' },
                  maxLength: { value: 50, message: 'Max 50 characters' },
                })}
              />
            ) : (
              <div className="mb-5 bg-slate-900/15 p-4.5 rounded-xl border border-slate-800/40">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">First Name</p>
                <p className="text-sm font-medium text-slate-200">{user?.firstName}</p>
              </div>
            )}

            {/* Last Name */}
            {isEditing ? (
              <InputField
                label="Last Name"
                name="lastName"
                placeholder="Last Name"
                icon={User}
                error={errors.lastName}
                {...register('lastName', {
                  required: 'Last name is required',
                  minLength: { value: 2, message: 'Min 2 characters' },
                  maxLength: { value: 50, message: 'Max 50 characters' },
                })}
              />
            ) : (
              <div className="mb-5 bg-slate-900/15 p-4.5 rounded-xl border border-slate-800/40">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Last Name</p>
                <p className="text-sm font-medium text-slate-200">{user?.lastName}</p>
              </div>
            )}

            {/* Mobile Number */}
            {isEditing ? (
              <InputField
                label="Mobile Number"
                name="mobileNumber"
                type="tel"
                placeholder="10-digit mobile"
                icon={Phone}
                maxLength={10}
                error={errors.mobileNumber}
                {...register('mobileNumber', {
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Mobile number must be exactly 10 digits',
                  },
                })}
              />
            ) : (
              <div className="mb-5 bg-slate-900/15 p-4.5 rounded-xl border border-slate-800/40">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Mobile Number</p>
                <p className="text-sm font-medium text-slate-200">{user?.mobileNumber}</p>
              </div>
            )}

            {/* City */}
            {isEditing ? (
              <InputField
                label="City"
                name="city"
                placeholder="City"
                icon={MapPin}
                error={errors.city}
                {...register('city', {
                  required: 'City is required',
                  maxLength: { value: 100, message: 'Max 100 characters' },
                })}
              />
            ) : (
              <div className="mb-5 bg-slate-900/15 p-4.5 rounded-xl border border-slate-800/40">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">City</p>
                <p className="text-sm font-medium text-slate-200">{user?.city}</p>
              </div>
            )}

            {/* Email (Always Read-only) */}
            {!isEditing && (
              <div className="mb-5 bg-slate-900/15 p-4.5 rounded-xl border border-slate-800/40">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Email Address</p>
                <div className="flex items-center gap-2 text-slate-200 text-sm">
                  <Mail size={16} className="text-slate-400" />
                  <span>{user?.email}</span>
                </div>
              </div>
            )}

            {/* Role (Always Read-only) */}
            {!isEditing && (
              <div className="mb-5 bg-slate-900/15 p-4.5 rounded-xl border border-slate-800/40">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Account Role</p>
                <div className="flex items-center gap-2 text-slate-200 text-sm">
                  <ShieldAlert size={16} className="text-slate-400" />
                  <span className="capitalize">{user?.role}</span>
                </div>
              </div>
            )}

          </div>

          {/* Action buttons (only visible during edit) */}
          {isEditing && (
            <div className="flex justify-end gap-3 mt-6 border-t border-slate-800/60 pt-6">
              <Button
                type="button"
                variant="secondary"
                disabled={saving}
                onClick={onCancel}
                fullWidth={false}
                className="flex items-center gap-1.5"
              >
                <X size={16} />
                <span>Cancel</span>
              </Button>
              
              <Button
                type="submit"
                loading={saving}
                fullWidth={false}
                className="flex items-center gap-1.5"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </Button>
            </div>
          )}
        </form>

      </div>
    </DashboardLayout>
  );
};

export default Profile;
