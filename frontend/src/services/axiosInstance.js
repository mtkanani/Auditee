import axios from 'axios';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.startsWith('http')) return envUrl;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://auditee-production.up.railway.app/api';
  }
  return 'http://localhost:8080/api';
};

const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Request Interceptor: Attach Bearer JWT Token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error messages & handle 401/403 session expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    // Session Expired / Unauthorized Handler
    if (status === 401) {
      console.warn('Session expired or unauthorized request. Cleaning up auth storage...');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userData');
      localStorage.removeItem('userRole');

      // Dispatch custom event for AuthContext to reset state smoothly
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    const formattedError = new Error(message);
    formattedError.status = status;
    formattedError.data = error.response?.data;

    return Promise.reject(formattedError);
  }
);

export default axiosInstance;
