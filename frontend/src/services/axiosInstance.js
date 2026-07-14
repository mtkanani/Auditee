import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach bearer token if it exists in local storage
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

// Response Interceptor: Format error messages before passing them to components
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract server error message if available
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Something went wrong';
    
    // Attach details to error object for caller consumption
    const formattedError = new Error(message);
    formattedError.status = error.response?.status;
    formattedError.data = error.response?.data;
    
    return Promise.reject(formattedError);
  }
);

export default axiosInstance;
