import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../../components/common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Lock, Save, TriangleAlert, User } from 'lucide-react';
import { Badge, Button, Card, Field, Input, PageHeader, PasswordInput } from '../../components/ui';
import { useUpdateUserProfile, useChangePassword } from '../../queries/useUsers';

const SectionTitle = ({ icon: Icon, children }) => (
  <span className="inline-flex items-center gap-2">
    <Icon className="w-4 h-4 text-accent-fg" aria-hidden="true" />
    {children}
  </span>
);

export const UserProfile = () => {
  const { user, updateUserState } = useAuth();

  const { register: regProfile, handleSubmit: handleSubmitProfile, reset: resetProfile, formState: { errors: profileErrors } } = useForm();
  const { register: regPass, handleSubmit: handleSubmitPass, reset: resetPass, formState: { errors: passErrors } } = useForm();

  const updateProfileMutation = useUpdateUserProfile();
  const changePasswordMutation = useChangePassword();

  const isLoading = updateProfileMutation.isPending;
  const isPasswordLoading = changePasswordMutation.isPending;

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
    try {
      await updateProfileMutation.mutateAsync(data);
      updateUserState(data);
    } catch {
      // toast error handled in hook
    }
  };

  const onChangePassword = async (data) => {
    try {
      await changePasswordMutation.mutateAsync({
        email: user.email,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      resetPass();
    } catch {
      // toast error handled in hook
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader title="My profile" description="Your personal details and password." />

      <Card>
        <div className="flex items-center gap-4 min-w-0">
          <Avatar firstName={user?.firstName} lastName={user?.lastName} size="xl" />
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-fg truncate">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-muted truncate">{user?.email}</p>
            <Badge tone="accent" className="mt-2">{user?.designation || 'Employee'}</Badge>
          </div>
        </div>
      </Card>

      <Card title={<SectionTitle icon={User}>Personal information</SectionTitle>}>
        <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First name" required error={profileErrors.firstName && 'First name is required'}>
              {(p) => <Input {...p} autoComplete="given-name" {...regProfile('firstName', { required: true })} />}
            </Field>
            <Field label="Last name" required error={profileErrors.lastName && 'Last name is required'}>
              {(p) => <Input {...p} autoComplete="family-name" {...regProfile('lastName', { required: true })} />}
            </Field>
            <Field label="Mobile number">
              {(p) => <Input {...p} type="tel" autoComplete="tel" {...regProfile('mobileNumber')} />}
            </Field>
            <Field label="City">
              {(p) => <Input {...p} autoComplete="address-level2" {...regProfile('city')} />}
            </Field>
          </div>
          <Button type="submit" variant="primary" icon={Save} loading={isLoading}>
            {isLoading ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </Card>

      <Card title={<SectionTitle icon={Lock}>Password</SectionTitle>}>
        <form onSubmit={handleSubmitPass(onChangePassword)} className="space-y-4 max-w-md">
          <Field label="Current password" required error={passErrors.currentPassword && 'Enter your current password'}>
            {(p) => <PasswordInput {...p} autoComplete="current-password" {...regPass('currentPassword', { required: true })} />}
          </Field>
          <Field
            label="New password"
            required
            hint="At least 8 characters."
            error={passErrors.newPassword && 'Use at least 8 characters'}
          >
            {(p) => <PasswordInput {...p} autoComplete="new-password" {...regPass('newPassword', { required: true, minLength: 8 })} />}
          </Field>
          <Button type="submit" variant="secondary" loading={isPasswordLoading}>
            {isPasswordLoading ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      </Card>

      <section className="p-5 rounded-2xl bg-danger-soft border border-danger/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-danger flex items-center gap-2">
            <TriangleAlert className="w-4 h-4" aria-hidden="true" />
            Delete account
          </h2>
          <p className="text-sm text-muted mt-1">Permanently delete your account and personal data.</p>
        </div>
        <Link
          to="/user/delete-account"
          className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-danger text-white text-sm font-medium hover:opacity-90 transition-opacity w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/50"
        >
          Delete account
        </Link>
      </section>
    </div>
  );
};
