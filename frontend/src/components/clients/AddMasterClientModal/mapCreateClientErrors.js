// Maps a failed create-client response onto the form fields it concerns.
export const mapCreateClientErrors = (serverMsg, serverErrors) => {
  const newFieldErrors = {};

  const lowerMsg = serverMsg.toLowerCase();

  if (lowerMsg.includes('email') || serverErrors.email) {
    newFieldErrors.email = lowerMsg.includes('already exists') || lowerMsg.includes('registered')
      ? 'This Email / Gmail address is already registered in Auditee. Please use a different email.'
      : (serverErrors.email || serverMsg);
  }
  if (lowerMsg.includes('phone') || lowerMsg.includes('mobile') || serverErrors.phone) {
    newFieldErrors.contactPersonPhone = 'This mobile number is already registered or invalid.';
  }
  if (lowerMsg.includes('gst') || serverErrors.gstNumber) {
    newFieldErrors.gstNumberInput = 'This GSTIN is already registered in your firm.';
  }
  if (lowerMsg.includes('pan') || serverErrors.panNumber) {
    newFieldErrors.panNumberInput = 'This PAN number is already registered in your firm.';
  }
  if (lowerMsg.includes('password') || serverErrors.password) {
    newFieldErrors.password = 'Password must be at least 6 characters long.';
  }

  return newFieldErrors;
};
