import { useForm } from 'react-hook-form';

export const useFirmForm = ({ onSubmit, defaultValues, isEdit }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaultValues || {
      firm: {
        firmName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
      },
      firmAdmin: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      },
    },
    mode: 'onChange',
  });

  const passwordValue = watch('firmAdmin.password');

  const onFormSubmit = async (data) => {
    // Flatten / clean data structure as expected by API
    const firmData = {
      firmName: data.firm.firmName,
      email: data.firm.email,
      phone: data.firm.phone,
      address: data.firm.address || undefined,
      city: data.firm.city || undefined,
      state: data.firm.state || undefined,
      country: data.firm.country || undefined,
      pincode: data.firm.pincode || undefined,
    };

    const adminData = {
      firstName: data.firmAdmin.firstName,
      lastName: data.firmAdmin.lastName,
      email: data.firmAdmin.email,
      phone: data.firmAdmin.phone,
      ...(isEdit ? {} : { password: data.firmAdmin.password }),
    };

    await onSubmit(firmData, adminData);
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    passwordValue,
    onFormSubmit,
  };
};
