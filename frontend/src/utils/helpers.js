/**
 * Helper utility functions for Auditee Enterprise Frontend
 */

// Format date to locale string
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  const defaultOptions = { year: 'numeric', month: 'short', day: 'numeric', ...options };
  return new Date(dateString).toLocaleDateString('en-US', defaultOptions);
};

// Format date time
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Capitalize words
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Normalize role names for display
export const formatRoleName = (role) => {
  if (!role) return 'User';
  const roles = {
    super_admin: 'Super Admin',
    SUPER_ADMIN: 'Super Admin',
    firm_admin: 'Firm Admin',
    FIRM_ADMIN: 'Firm Admin',
    admin: 'Firm Admin',
    user: 'Employee User',
    USER: 'Employee User',
    employee: 'Employee User',
    client: 'Client',
    CLIENT: 'Client',
  };
  return roles[role] || capitalize(role);
};

// Role normalization for route authorization
export const normalizeRole = (role) => {
  if (!role) return 'USER';
  const r = role.toUpperCase();
  if (r === 'SUPER_ADMIN') return 'SUPER_ADMIN';
  if (r === 'FIRM_ADMIN' || r === 'ADMIN') return 'FIRM_ADMIN';
  if (r === 'CLIENT') return 'CLIENT';
  return 'USER';
};

// Generate initials from first and last name
export const getInitials = (firstName = '', lastName = '') => {
  const f = firstName ? firstName.charAt(0).toUpperCase() : '';
  const l = lastName ? lastName.charAt(0).toUpperCase() : '';
  return (f + l) || 'U';
};

// Color badge resolver for status
export const getStatusBadgeColor = (status) => {
  const s = String(status).toUpperCase();
  switch (s) {
    case 'ACTIVE':
    case 'COMPLETED':
    case 'VERIFIED':
    case 'HIGH':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'PENDING':
    case 'IN_PROGRESS':
    case 'IN PROGRESS':
    case 'MEDIUM':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'INACTIVE':
    case 'SUSPENDED':
    case 'DELETED':
    case 'URGENT':
      return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    case 'LOW':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};
