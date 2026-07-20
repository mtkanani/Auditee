import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../services/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Determine initial role dashboard path
  const getRoleDashboardPath = (role) => {
    if (!role) return '/login';
    const r = role.toLowerCase();
    if (r === 'super_admin') return '/super-admin/dashboard';
    if (r === 'firm_admin' || r === 'admin') return '/firm-admin/dashboard';
    if (r === 'client') return '/client/dashboard';
    return '/user/dashboard';
  };

  // Initialize auth state from localStorage or fetch /api/auth/me
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('userData');

      if (storedToken) {
        setAccessToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } catch {
            // parsing error
          }
        }

        try {
          // Verify & fetch fresh session profile from backend
          const res = await axiosInstance.get('/auth/me');
          if (res.data?.data) {
            const userData = res.data.data;
            setUser(userData);
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('userRole', userData.role || 'user');
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.warn('Session check failed:', error?.message);
          // If token invalid, trigger logout
          if (error?.status === 401) {
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();

    // Listen for unauthorized 401 events from axios interceptor
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      const data = res.data;

      const { tokens, user: userData } = data;
      const token = tokens.accessToken;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userRole', userData.role || 'user');

      setAccessToken(token);
      setUser(userData);
      setIsAuthenticated(true);

      const redirectPath = getRoleDashboardPath(userData.role);
      return { user: userData, redirectPath };
    } catch (error) {
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.post('/auth/register', payload);
      return res.data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
  };

  const updateUserState = (updatedUserData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedUserData };
      localStorage.setItem('userData', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUserState,
        getRoleDashboardPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
