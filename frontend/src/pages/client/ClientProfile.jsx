import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Briefcase, Save } from 'lucide-react';
import { Button, Card, Field, Input, PageHeader } from '../../components/ui';
import { useUpdateClientProfile } from '../../queries/useClients';

export const ClientProfile = () => {
  const { user, updateUserState } = useAuth();
  const updateProfileMutation = useUpdateClientProfile();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        clientName: user.clientName || user.name || '',
        companyName: user.companyName || '',
        phone: user.phone || '',
        city: user.city || '',
        gstNumber: user.gstNumber || '',
        businessType: user.businessType || '',
      });
    }
  }, [user, reset]);

  const onUpdateProfile = (data) => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        updateUserState(data);
      },
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader title="Profile" description="Your business details, GSTIN and contact number." />

      <Card
        title={
          <span className="inline-flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-accent-fg" aria-hidden="true" />
            Business details
          </span>
        }
      >
        <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name" required error={errors.clientName && 'Name is required'}>
              {(p) => <Input {...p} autoComplete="name" {...register('clientName', { required: true })} />}
            </Field>
            <Field label="Company name">
              {(p) => <Input {...p} autoComplete="organization" {...register('companyName')} />}
            </Field>
            <Field label="GSTIN">
              {(p) => <Input {...p} className="uppercase" maxLength={15} {...register('gstNumber')} />}
            </Field>
            <Field label="Business type" hint="e.g. Private limited, LLP, proprietorship">
              {(p) => <Input {...p} {...register('businessType')} />}
            </Field>
            <Field label="Phone">
              {(p) => <Input {...p} type="tel" autoComplete="tel" {...register('phone')} />}
            </Field>
            <Field label="City">
              {(p) => <Input {...p} autoComplete="address-level2" {...register('city')} />}
            </Field>
          </div>

          <Button type="submit" variant="primary" icon={Save} loading={updateProfileMutation.isPending}>
            {updateProfileMutation.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
