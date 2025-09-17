import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, login, error: authError, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Message from redirects (e.g., successful registration)
  const message = location.state?.message || '';
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      const redirectPath = location.state?.from || '/';
      navigate(redirectPath);
    }
  }, [currentUser, navigate, location]);
  
  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!email || !password) {
      setError(t('loginPage.fillAllFields'));
      return;
    }
    
    try {
      await login(email, password);
      
      // If login successful, will redirect via the useEffect
    } catch (err) {
      // Get error message from API response if available
      const errorMsg = err.response?.data?.message || 
                      authError || 
                      t('loginPage.loginFailed');
      setError(errorMsg);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">{t('loginPage.title')}</h1>
          
          {message && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-4 py-3 rounded-md mb-4">
              {message}
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('loginPage.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder={t('common.emailPlaceholder')}
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('loginPage.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder={t('common.passwordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full py-2"
              disabled={authLoading}
            >
              {authLoading ? t('loginPage.signingIn') : t('loginPage.signIn')}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
              {t('loginPage.forgotPassword')}
            </Link>
          </div>
          
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('loginPage.noAccount')}{' '}
              <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                {t('loginPage.signUp')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;