import { createContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Fetch fresh user data from API
          const response = await api.get('/auth/me');
          if (response.data.status === 'success' && response.data.data) {
            setCurrentUser(response.data.data);
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(response.data.data));
          }
        } catch (err) {
          console.error('Failed to fetch user data:', err);
          // If token is invalid, clear localStorage
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          } else {
            // Fallback to localStorage data if API fails but token exists
            const user = AuthService.getCurrentUser();
            setCurrentUser(user);
          }
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AuthService.login(email, password);
      
      if (response.status === 'success' && response.data.user) {
        setCurrentUser(response.data.user);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred during login';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AuthService.register(userData);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred during registration';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AuthService.updateProfile(userData);
      
      if (response.status === 'success' && response.data) {
        setCurrentUser(response.data);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred while updating profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
