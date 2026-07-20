import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Avatar } from '../../components/common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { FiUser, FiLock, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';

export const UserProfile = () => {
  const { user, updateUserState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const { register: regProfile, handleSubmit: handleSubmitProfile, reset: resetProfile } = useForm();
  const { register: regPass, handleSubmit: handleSubmitPass, reset: resetPass, watch } = useForm();

  const newPassword = watch('newPassword');

  useEffect(() => {
    if (user) {
      resetProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        mobileNumber: user.mobileNumber || user.phone || '',
        city: user.city || '',
        designation: user.designation || '',
      });
    }
  }, [user, resetProfile]);

  const onUpdateProfile = async (data) => {
    setIsLoading(true);
    try {
      const res = await userService.updateProfile(data);
      updateUserState(data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const onChangePassword = async (data) => {
    setIsPasswordLoading(true);
    try {
      await authService.changePassword(user.email, data.currentPassword, data.newPassword);
      toast.success('Password changed successfully!');
      resetPass();
    } catch (error) {
      toast.error(error.message || 'Failed to change password.');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="My Profile & Settings"
        subtitle="Manage your personal details, designation, and security password"
      />

      {/* User Info Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex items-center gap-6">
        <Avatar firstName={user?.firstName} lastName={user?.lastName} size="xl" />
        <div>
          <h2 className="text-xl font-bold text-slate-100">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          <span className="inline-block mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {user?.designation || 'Staff Accountant'}
          </span>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
          <FiUser className="text-indigo-400" />
          <span>Personal Information</span>
        </h3>

        <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
              <input
                type="text"
                {...regProfile('firstName', { required: true })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
              <input
                type="text"
                {...regProfile('lastName', { required: true })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number</label>
              <input
                type="text"
                {...regProfile('mobileNumber')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
              <input
                type="text"
                {...regProfile('city')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2"
          >
            <FiSave className="w-4 h-4" />
            <span>{isLoading ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>

      {/* Security & Change Password */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
          <FiLock className="text-purple-400" />
          <span>Security & Change Password</span>
        </h3>

        <form onSubmit={handleSubmitPass(onChangePassword)} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
            <input
              type="password"
              {...regPass('currentPassword', { required: true })}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              {...regPass('newPassword', { required: true, minLength: 8 })}
              placeholder="NewPassword@123"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isPasswordLoading}
            className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition-all"
          >
            {isPasswordLoading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
