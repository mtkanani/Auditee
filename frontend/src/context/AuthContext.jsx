import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from local storage on load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      const storedEmail = localStorage.getItem('userEmail');

      if (storedToken && storedEmail) {
        try {
          // Verify session token by fetching the fresh user profile
          const profile = await userApi.getProfile(storedEmail);
          setUser(profile);
          setAccessToken(storedToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Session validation failed. Logging out...', error);
          // Token expired or invalid
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(email, password);
      
      // If backend requires OTP verification, return early so frontend can prompt for it
      if (data.requireOtp) {
        return data;
      }

      const { tokens, user: basicUser } = data;

      // Store tokens temporarily in localStorage to authorize subsequent getProfile call
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('userEmail', basicUser.email);

      // Fetch user profile to populate all fields (like city and mobileNumber)
      const fullProfile = await userApi.getProfile(basicUser.email);

      setUser(fullProfile);
      setAccessToken(tokens.accessToken);
      setIsAuthenticated(true);
      
      return fullProfile;
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userEmail');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify login OTP and complete authentication
   * @param {string} email
   * @param {string} otp
   */
  const verifyLoginOtp = async (email, otp) => {
    setIsLoading(true);
    try {
      const data = await authApi.loginVerifyOTP(email, otp);
      const { tokens, user: basicUser } = data;

      // Store tokens temporarily in localStorage to authorize subsequent getProfile call
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('userEmail', basicUser.email);

      // Fetch user profile to populate all fields (like city and mobileNumber)
      const fullProfile = await userApi.getProfile(basicUser.email);

      setUser(fullProfile);
      setAccessToken(tokens.accessToken);
      setIsAuthenticated(true);
      
      return fullProfile;
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userEmail');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Log out current user and clear sessions
   */
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
  };

  /**
   * Refresh user profile details from backend
   */
  const refreshProfile = async () => {
    if (!user?.email) return;
    try {
      const updatedProfile = await userApi.getProfile(user.email);
      setUser(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Error refreshing profile:', error);
      throw error;
    }
  };

  /**
   * Manually update user state (e.g. after a profile update response)
   * @param {object} updatedUserData
   */
  const updateUserState = (updatedUserData) => {
    setUser((prev) => ({
      ...prev,
      ...updatedUserData,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        isLoading,
        login,
        verifyLoginOtp,
        logout,
        refreshProfile,
        updateUserState,
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
